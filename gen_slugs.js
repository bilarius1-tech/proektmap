
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const url = "postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public";
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

function transliterate(text) {
    const cyr = [
        ["а","a"],["б","b"],["в","v"],["г","g"],["д","d"],["е","e"],["ё","yo"],
        ["ж","zh"],["з","z"],["и","i"],["й","y"],["к","k"],["л","l"],["м","m"],
        ["н","n"],["о","o"],["п","p"],["р","r"],["с","s"],["т","t"],["у","u"],
        ["ф","f"],["х","kh"],["ц","ts"],["ч","ch"],["ш","sh"],["щ","sch"],
        ["ъ",""],["ы","y"],["ь",""],["э","e"],["ю","yu"],["я","ya"],
        ["А","A"],["Б","B"],["В","V"],["Г","G"],["Д","D"],["Е","E"],["Ё","Yo"],
        ["Ж","Zh"],["З","Z"],["И","I"],["Й","Y"],["К","K"],["Л","L"],["М","M"],
        ["Н","N"],["О","O"],["П","P"],["Р","R"],["С","S"],["Т","T"],["У","U"],
        ["Ф","F"],["Х","Kh"],["Ц","Ts"],["Ч","Ch"],["Ш","Sh"],["Щ","Sch"],
        ["Ъ",""],["Ы","Y"],["Ь",""],["Э","E"],["Ю","Yu"],["Я","Ya"],
    ];
    for (const [k, v] of cyr) text = text.replaceAll(k, v);
    text = text.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
    return text || "tool";
}

async function main() {
    const tools = await db.aITool.findMany();
    for (const t of tools) {
        if (t.slug && t.slug.length > 0 && t.slug !== "") continue;
        let base = transliterate(t.name);
        let slug = base;
        let counter = 1;
        while (true) {
            const existing = await db.aITool.findUnique({ where: { slug } });
            if (!existing || existing.id === t.id) break;
            slug = base + "-" + counter;
            counter++;
        }
        await db.aITool.update({ where: { id: t.id }, data: { slug } });
        console.log(t.name + " -> " + slug);
    }
    console.log("All slugs generated!");
    process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
