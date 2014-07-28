var TTTApp = angular.module('TTTApp', []);
TTTApp.controller("cubeController", ["$scope",
  function($scope) {

    // var TTTRef = new Firebase("https://initialtictac.firebaseIO.com");

    // $scope.clickCounter = $firebase(new Firebase("https://initialtictac.firebaseIO.com" + '/clickCounter'));

    // $scope.remoteCellList = 
    // $firebase(new Firebase("https://initialtictac.firebaseIO.com" + '/remoteCellList')) ;

    // $scope.clickCount = 0 ;

    //   $scope.remoteCellList.$bind($scope, "cellz");
    // $scope.$watch('cellz', function() {
    //   console.log('Model changed!') ;
    // }) ;

  //   $scope.dropSuccessHandler = function(event, index, array) {
  //   console.log(array);
  //   alert('sup!');
  // };

  // $scope.onDrop = function(event, data, array) {
  //   array.push(data);
  //   console.log(array);
  // };

    var winCombos = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
      ];
    $scope.phase = 0;
    $scope.p1_wins = 0;
    $scope.p2_wins = 0;
    $scope.games_played = 0;

    $scope.init = function() {
      $scope.games_played++;
      console.log($scope.games_played);
      $scope.dropped = [];
      $scope.items = [
        {id: 0, player: 1}, 
        {id: 1, player: 1},
        {id: 2, player: 1},
        {id: 3, player: 1},
        {id: 4, player: 1}, 
        {id: 5, player: 2},
        {id: 6, player: 2},
        {id: 7, player: 2},
        {id: 8, player: 2}
      ];
      $scope.cells      = ['','','','','','','','',''];
      
      $scope.cellz = [
        {idee:0, owner:null, win:null, color:null},
        {idee:1, owner:null, win:null, color:null},
        {idee:2, owner:null, win:null, color:null},
        {idee:3, owner:null, win:null, color:null},
        {idee:4, owner:null, win:null, color:null},
        {idee:5, owner:null, win:null, color:null},
        {idee:6, owner:null, win:null, color:null},
        {idee:7, owner:null, win:null, color:null},
        {idee:8, owner:null, win:null, color:null}];

      $scope.moves = 1; //no moves made (initialize at 1 so player 1 is odd / player 2 is even)
      $scope.player1_moves = 0;
      $scope.player2_moves = 0; 
      $scope.p_number = "Start"; //player is undefined initially
      $scope.results  = ['','','','','','','','',''];
      $scope.winner   = ""
      $scope.catsgame = ""
      $scope.winner_declared= false;
    } 


    $scope.hover = function(cell) {
      var i = 0;
      if ($scope.moves %2!=0) {
        $scope.square_colors = ["blue1", "blue2", "blue3", "blue4", "blue5"];
      }
      else {
        $scope.square_colors = ["red1", "red2", "red3", "red4", "red5"];
      }
      // cell.color = "blue1";
      $scope.changeColor = setInterval(function() {
        if (cell.owner == null) {
          cell.color = $scope.square_colors[i];
          console.log($scope.player1_moves);
          
          // document.getElementById('cell').style.background = $scope.square_colors[i];
          i++;
          console.log(cell);
          console.log(cell.color);
          if (i==$scope.square_colors.length){
            i=0;
          }
        }
      }, 500);   
      // 
    }
    
    $scope.unhover = function(cell){
      clearInterval($scope.changeColor);
      if (cell.owner == null) {
        cell.color = null;
      }
      console.log(cell.color);
    }

    $scope.namePlayer = function(player) {
      if (player == 1) {
        $scope.phase +=1;
        document.getElementById("p1_input").blur();
        document.getElementById("p2_input").focus();
      }
      else {  
        $scope.phase +=2;
      }      
    }

    $scope.player_move = function(cell) {
      // clearInterval($scope.changeColor);
      console.log("test");
      //setting plater names to default if no input
      if ($scope.player1_input==undefined) {
        $scope.player1_input = "Player 1"; 
      }
      if ($scope.player2_input==undefined){
        $scope.player2_input = "Player 2";
      }

      if ($scope.moves %2!=0) { //odds (player 1)
        $scope.p_number = "p1";
        $scope.p_opponent = "p2";
      }
      else { //even (player 2)
        $scope.p_number = "p2";
        $scope.p_opponent = "p1";
      }
      play_game(cell, $scope.p_number, $scope.p_opponent);
    }

    var play_game = function(cell, player, opponent) {
      if ($scope.results[cell.idee] == opponent){
        alert("Your opponent already owns that space. Choose Another");
      }
      else if ($scope.results[cell.idee] == player){
        alert("You already own that space. Choose Another");
      }
      else { //executes square ownership assignment
        $scope.results[cell.idee] = player;
        $scope.moves ++;
        if ($scope.p_number == "p1") {
          if (cell.color == null) {cell.color = "blue1";}
          $scope.player1_moves++;
          $scope.next_turn = $scope.player2_input;
          cell.owner = player;
          $scope.color = cell.color
        }
        else {
          if (cell.color == null) {cell.color = "red1";}
          $scope.player2_moves++;
          $scope.next_turn = $scope.player1_input;
          cell.owner = player;
        };

        //win logic
        if ($scope.moves>5){
          $scope.winner_declared = false;
          for (var i = 0; i < winCombos.length; i++){
            var combo = winCombos[i];
            if (($scope.results[combo[0]]==$scope.results[combo[1]]) && ($scope.results[combo[1]]==$scope.results[combo[2]]) && ($scope.results[combo[0]]!="")) {
              $scope.winning_array = winCombos[i];
              cell.win=false;
              console.log($scope.cellz);
              if ($scope.results[combo[0]] == "p1"){
                $scope.winner_declared = true;
                $scope.p1_wins++;
                $scope.winner = $scope.player1_input;
                win_sequence($scope.player1_input, $scope.winning_array);
              }
              else if ($scope.results[combo[0]] == "p2"){
                $scope.winner_declared = true;
                $scope.p2_wins++
                $scope.winner = $scope.player2_input;
                win_sequence($scope.player2_input, $scope.winning_array);
              }
            }
          }
          if ($scope.winner_declared == false && $scope.moves == 10) {
              $scope.catsgame = true;
            }
        }
      }
    } 

    function win_sequence(winner, win_array) {
      $scope.cellz[win_array[0]].win = "win";
      $scope.cellz[win_array[1]].win = "win";
      $scope.cellz[win_array[2]].win = "win";
    }

    $scope.init();

}])
.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    })
;
