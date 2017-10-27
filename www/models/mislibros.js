app.factory('mislibros', function($cordovaSQLite, DBA) {
    var self = this;
  
    self.all = function() {
      return DBA.query("SELECT * FROM libros")
        .then(function(result){
          return DBA.getAll(result);
        });
    }
  
    self.get = function(memberId) {
      var parameters = [memberId];
      return DBA.query("SELECT * FROM libros WHERE id = (?)", parameters)
        .then(function(result) {
          return DBA.getById(result);
        });
    }
  
    self.add = function(member) {
      var parameters = [member.id,member.nombre,member.ruta,member.width,member.height];
      return DBA.query("INSERT INTO libros (id, nombre,ruta,width,height) VALUES (?,?,?,?,?)", parameters);
    }
  
    self.remove = function(member) {
      var parameters = [member.id];
      return DBA.query("DELETE FROM team WHERE id = (?)", parameters);
    }
  
    self.update = function(origMember, editMember) {
      var parameters = [editMember.id, editMember.name, origMember.id];
      return DBA.query("UPDATE team SET id = (?), name = (?) WHERE id = (?)", parameters);
    }
  
    return self;
  });