
define([
  'jquery',
  'underscore',
  'backbone',
  'collections/users/UsersCollection',
  'text!templates/users/usersTemplate.html'
], function($, _, Backbone, UsersCollection, usersTemplate){
  
  var UserView = Backbone.View.extend({
    el: $("#page"),
    
    initialize: function(){

      var usersCollection = new UsersCollection();
      this.collection = usersCollection;

      console.log("usersCollection model name %s", this.collection.models[0].get('name') );

      this.collection.bind("add", this.bindAddHandler);
      this.collection = usersCollection.add({ name: "brandon", score: 20});
    },

    bindAddHandler: function( model ){
      console.log("UserView / bindAddHandler / user added: %s", model.get("name") );
    },

    render: function(){
      console.log("UserView / render");
      
      var data = {
        users: this.collection.models,
        _: _
      };
      var compiledTemplate = _.template( usersTemplate, data );
      $("#page").html( compiledTemplate );
    }

  });
  
  return UserView;

});
