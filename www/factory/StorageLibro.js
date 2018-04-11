app.factory('StorageLibro', function() {
    return {
      all: function () {
        var projectString = window.localStorage['libros'];
        if (projectString) {
            //return angular.fromJson(projectString);
            return JSON.parse(projectString);
        }
        return [];
    },
    save: function (libros) {
        //window.localStorage['libros'] = angular.toJson(libros);
        window.localStorage['libros'] = JSON.stringify(libros);
    },
    nuevoLibro: function (NombreLibro) {
        // Add a new project
        return {
            Titulo: NombreLibro,
            Separadores: [],
            Notas:[],
            Rayado:[],
            Subrayado:[]
        };
    }
  }
})