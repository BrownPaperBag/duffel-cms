raptor(function($) {
  $('.cms-block').raptor({
    plugins: {
      dock: {
        docked: true,
        dockToScreen: true,
        dockUnder: '.duffel-visor-spacer'
      },
      save: {
        plugin: 'saveRest'
      },
      saveRest: {
        url: '/cms/admin/content/',
        data: function(html) {
          return {
            name: this.raptor.getElement().data('name'),
            _csrf: this.raptor.getElement().data('csrf'),
            type: this.raptor.getElement().data('type'),
            html: html
          };
        }
      }
    }
  });
});
