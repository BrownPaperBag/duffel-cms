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
            id: this.raptor.getElement().data('name'),
            _csrf: this.raptor.getElement().data('csrf'),
            content: html
          };
        }
      }
    }
  });
});
