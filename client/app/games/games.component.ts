'use strict';

const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routes from './games.routes';

export class GamesController {
  $http;
  socket;
  games = [];
  originalGames = [];
  newGame = {};
  filter = "none";

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
      this.originalGames = response.data;
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
      this.games[game].edit = false;
  };

  resetGames = function(){
      this.games = this.originalGames;
      this.filter = 'none';
  }

  filterByGenre = function(genre){
      this.resetGames();
      this.games = this.games.filter(function(game){
        return game.genre === genre;
      });
      this.filter = 'Genre: ' + genre;
  };

  filterByPlatform = function(platform){
      this.resetGames();
      this.games = this.games.filter(function(game){
        return game.platform === platform;
      });
      this.filter = 'Platform: ' + platform;
  };
}

export default angular.module('meanTutorialApp.games', [uiRouter])
  .config(routes)
  .component('games', {
    template: require('./games.html'),
    controller: GamesController
  })
  .name;
