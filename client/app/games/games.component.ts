'use strict';

const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routes from './games.routes';

export class GamesController {
  $http;
  socket;
  games = [];
  newGame = {};

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('games');
    });
  }

  $onInit() {
    this.$http.get('/api/games').then(response => {
      this.games = response.data;
      this.socket.syncUpdates('games', this.games);
    });
  }

  addGame() {
    if (this.newGame) {
      this.$http.post('/api/games', this.newGame);
      this.games.push(this.newGame);
      this.newGame = {};
    }
  }

  deleteGame(game) {
    this.$http.delete('/api/games/' + game._id);
    this.games.splice(game, 1);
  }

  toggleEdit = function(game){
      this.games[game].edit = !this.games[game].edit;
  };

  saveGame = function(game){
      this.$http.put('/api/games/' + this.games[game]._id, this.games[game]);
  };
}

export default angular.module('meanTutorialApp.games', [uiRouter])
  .config(routes)
  .component('games', {
    template: require('./games.html'),
    controller: GamesController
  })
  .name;
