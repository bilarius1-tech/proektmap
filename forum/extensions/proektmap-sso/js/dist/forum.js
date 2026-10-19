// Без сборщика: файл подключается как есть (Extend\Frontend->js). Пишется вручную, ES2017.
(() => {
  'use strict';

  const unwrap = (mod) => (mod && mod.__esModule ? mod.default : mod);
  const app = unwrap(flarum.reg.get('core', 'forum/app'));
  const { extend } = flarum.reg.get('core', 'common/extend');
  const Icon = unwrap(flarum.reg.get('core', 'common/components/Icon'));

  app.initializers.add('proektmap-sso', () => {
    extend('flarum/forum/components/HeaderPrimary', 'items', function (items) {
      items.add(
        'proektmap-home',
        m('a', { className: 'Button Button--link pm-home-link', href: 'https://proektmap.ru/' }, [
          m(Icon, { name: 'fas fa-house', className: 'Button-icon' }),
          m('span', { className: 'Button-label' }, app.translator.trans('proektmap-sso.forum.header.home_link')),
        ]),
        100
      );
    });
  });

  module.exports = {};
})();
