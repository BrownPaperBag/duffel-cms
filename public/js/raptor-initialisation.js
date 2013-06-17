$(function() {
  $('.cms-block').raptor({
    plugins: {
      dock: {
        docked: true
      },
      save: {
        plugin: 'saveRest'
      },
      saveRest: {
        url: '/cms/admin/content',
        data: function(html) {
          return {
            id: this.raptor.getElement().data('id'),
            content: html
          };
        }
      }
    }
  });
});
