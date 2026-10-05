import { randomBytes } from "crypto";
import { getDb } from "@/lib/db/index";

type YooPayment = {
  id?: string;
  status?: string;
  description?: string;
  confirmation?: { confirmation_url?: string };
  amount?: { value?: string; currency?: string };
  metadata?: { purpose?: string; orderId?: string; email?: string };
};

function rubles(value: string | number) {
  return String(Math.round(Number(value))) + ".00";
}

async function yookassaAuth() {
  const db = await getDb();
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  const shopId = settings?.yookassaShopId || "";
  const secretKey = settings?.yookassaSecretKey || "";
  if (!shopId || !secretKey) {
    throw new Error("ЮKassa не настроена. Добавьте shopId и secretKey в админке.");
  }
  return { shopId, secretKey };
}

async function yookassa(path: string, init?: RequestInit) {
  const { shopId, secretKey } = await yookassaAuth();
  const res = await fetch("https://api.yookassa.ru/v3" + path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64"),
      ...(init?.headers as Record<string, string> | undefined),
    },
  });
  const data = (await res.json()) as YooPayment & { type?: string; description?: string };
  return { ok: res.ok, data };
}

export async function createShopCheckout(input: {
  productId: string;
  email: string;
  userId?: string | null;
}) {
  const db = await getDb();
  const product = await db.digitalProduct.findFirst({
    where: { id: input.productId, isPublished: true },
  });
  if (!product) throw new Error("Товар не найден или снят с публикации");
  if (!product.fileName) throw new Error("К товару не прикреплён файл");
  if (!Number.isInteger(product.priceRub) || product.priceRub < 1) {
    throw new Error("У товара не задана цена");
  }

  const order = await db.shopOrder.create({
    data: {
      publicToken: randomBytes(24).toString("hex"),
      email: input.email,
      userId: input.userId || null,
      status: "pending",
      amount: product.priceRub,
      items: {
        create: {
          productId: product.id,
          title: product.title,
          priceRub: product.priceRub,
          fileName: product.fileName,
          originalName: product.originalName || product.fileName,
          kind: product.kind,
        },
      },
    },
    include: { items: true },
  });

  const item = order.items[0];
  const subject = product.kind === "book" ? "intellectual_activity" : "commodity";
  const description = product.title.slice(0, 128);

  const { ok, data } = await yookassa("/payments", {
    method: "POST",
    headers: { "Idempotence-Key": order.id },
    body: JSON.stringify({
      amount: { value: rubles(product.priceRub), currency: "RUB" },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: `https://proektmap.ru/zakaz/${order.publicToken}`,
      },
      description,
      metadata: {
        purpose: "shop",
        orderId: order.id,
        email: input.email,
      },
      receipt: {
        customer: { email: input.email },
        items: [
          {
            description,
            quantity: "1.00",
            amount: { value: rubles(item.priceRub), currency: "RUB" },
            vat_code: 1,
            payment_mode: "full_payment",
            payment_subject: subject,
          },
        ],
      },
    }),
  });

  if (!ok || data.status !== "pending" || !data.confirmation?.confirmation_url || !data.id) {
    await db.shopOrder.update({
      where: { id: order.id },
      data: { status: "canceled" },
    });
    throw new Error(data.description || "ЮKassa не создала платёж");
  }

  await db.shopOrder.update({
    where: { id: order.id },
    data: { yookassaId: data.id },
  });

  return {
    confirmationUrl: data.confirmation.confirmation_url,
    token: order.publicToken,
  };
}

function paidRubles(payment: YooPayment) {
  return Math.round(Number(payment.amount?.value || "0"));
}

export async function markShopOrderFromPayment(payment: YooPayment) {
  if (payment.metadata?.purpose !== "shop") return { ok: false as const, reason: "not-shop" };
  const orderId = payment.metadata.orderId;
  if (!orderId || !payment.id) return { ok: false as const, reason: "no-order" };

  const db = await getDb();
  const order = await db.shopOrder.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) return { ok: false as const, reason: "missing" };

  if (order.status === "paid") {
    if (order.yookassaId && order.yookassaId !== payment.id) {
      return { ok: false as const, reason: "other-payment" };
    }
    return { ok: true as const, order };
  }

  if (order.yookassaId && order.yookassaId !== payment.id) {
    return { ok: false as const, reason: "other-payment" };
  }

  const expected = order.items.reduce((sum, item) => sum + item.priceRub, 0);
  if (paidRubles(payment) !== expected || expected !== order.amount) {
    console.error("Shop payment amount mismatch", order.id, payment.id);
    return { ok: false as const, reason: "amount" };
  }

  if (payment.status === "succeeded") {
    await db.shopOrder.updateMany({
      where: { id: order.id, status: "pending" },
      data: {
        status: "paid",
        paidAt: new Date(),
        yookassaId: payment.id,
      },
    });
  }

  if (payment.status === "canceled") {
    await db.shopOrder.updateMany({
      where: { id: order.id, status: "pending" },
      data: { status: "canceled", yookassaId: payment.id },
    });
  }

  const fresh = await db.shopOrder.findUnique({
    where: { id: order.id },
    include: { items: true },
  });
  return { ok: true as const, order: fresh };
}

export async function syncShopOrderByToken(token: string) {
  const db = await getDb();
  const order = await db.shopOrder.findUnique({
    where: { publicToken: token },
    include: { items: true },
  });
  if (!order || order.status !== "pending" || !order.yookassaId) return order;

  try {
    const { data } = await yookassa("/payments/" + order.yookassaId);
    if (data?.id) await markShopOrderFromPayment(data);
  } catch (error) {
    console.error("Shop sync error", error);
  }

  return db.shopOrder.findUnique({
    where: { publicToken: token },
    include: { items: true },
  });
}
