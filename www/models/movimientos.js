app.factory('movimientos', function($cordovaSQLite, DBA) {
    var self = this;
  
    self.all = function() {
      return DBA.query("SELECT * FROM movimientos")
        .then(function(result){
          return DBA.getAll(result);
        });
    }
  
    self.get = function(memberId) {
      var parameters = [memberId];
      return DBA.query("SELECT * FROM movimientos WHERE id = (?)", parameters)
        .then(function(result) {
          return DBA.getById(result);
        });
    }

    self.SaldoLibros = function() {
      return DBA.query("select Sum(entrada)-Sum(salida) as Total from movimientos;")
        .then(function(result) {
          return DBA.getById(result);
        });
    }
  
    self.add = function(member) {
      var parameters = [member.id,member.codigo,member.entrada,member.salida];
      return DBA.query("INSERT INTO movimientos (id,codigo,entrada,salida) VALUES (?,?,?,?)", parameters);
    }
  
    self.remove = function(member) {
      var parameters = [member.id];
      return DBA.query("DELETE FROM movimientos WHERE id = (?)", parameters);
    }
  
    self.update = function(origMember, editMember) {
      var parameters = [editMember.id, editMember.name, origMember.id];
      return DBA.query("UPDATE movimientos SET id = (?), name = (?) WHERE id = (?)", parameters);
    }
  
    return self;
  });