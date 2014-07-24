    var tictactoe = angular.module("tictactoe", ["firebase"])
    tictactoe.controller('cubeController', ['$scope', function($scope, $firebase) {
      
    var TTTref = new Firebase("https://initialtictac.firebaseIO.com");

    $scope.remoteCellList = $firebase(new Firebase("https://initialtictac.firebaseIO.com/remoteCellList"));

    
      // // $scope.cellz.$add(cell);

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

      $scope.init = function() {
        $scope.cellz = [
          {idee:0, owner:null, win:null},
          {idee:1, owner:null, win:null},
          {idee:2, owner:null, win:null},
          {idee:3, owner:null, win:null},
          {idee:4, owner:null, win:null},
          {idee:5, owner:null, win:null},
          {idee:6, owner:null, win:null},
          {idee:7, owner:null, win:null},
          {idee:8, owner:null, win:null},
          ];

         $scope.remoteCellList.$bind($scope, "cellz");

    $scope.$watch('cellz', function(){
    console.log('Model changed!');
    });
        $scope.moves = 1; //no moves made (initialize at 1 so player 1 is odd / player 2 is even)
        $scope.player1_moves=0;
        $scope.player2_moves=0; 
        $scope.player = "Start";
        $scope.p_number = ""; //player is undefined initially
        $scope.results = ['','','','','','','','',''];
        $scope.winner = false;
        $scope.catsgame = false;
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
        if ($scope.player1_input==undefined) {
          $scope.player1_input = "Player 1"; 
        }
        if ($scope.player2_input==undefined){
          $scope.player2_input = "Player 2";
        }

        if ($scope.moves %2!=0) { //odds (player 1)
          $scope.player = "Player 1";
          $scope.p_number = "p2";
          play_game(cell, "p1", "p2");
        }
        else { //even (player 1)
          $scope.player = "Player 2";
          $scope.p_number = "p1";
          play_game(cell, "p2", "p1");
        }
      }

      var play_game = function(cell, player, opponent) {
        if ($scope.results[cell.idee] == opponent){
          alert("Your opponent already owns that space. Choose Another");
        }
        else if ($scope.results[cell.idee] == player){
          alert("You already own that space. Choose Another");
        }
        else {
          $scope.results[cell.idee] = player;

          $scope.moves ++;
          if ($scope.player == "Player 1") {
            $scope.player1_moves++;
            $scope.next_turn = $scope.player2_input;
            cell.owner = player;
          }
          else {
            $scope.player2_moves++;
            $scope.next_turn = $scope.player1_input;
            cell.owner = player;
            cell.$save("owner");
          }
    
        ////win logic
           if ($scope.moves>5){

            for (var i = 0; i < winCombos.length; i++){ 
              var combo = winCombos[i];
              //if all items in win array are the same player, win!
              if (($scope.results[combo[0]]==$scope.results[combo[1]]) && ($scope.results[combo[1]]==$scope.results[combo[2]]) && ($scope.results[combo[0]]!="")) {
                $scope.winning_array = winCombos[i];

                if ($scope.results[combo[0]] == "p1"){
                  $scope.p1_wins++;
                  $scope.winner = $scope.player1_input;
                  win_sequence($scope.player1_input, $scope.winning_array);
                }
                else if ($scope.results[combo[0]] == "p2"){
                  $scope.p2_wins++
                  $scope.winner = $scope.player2_input;
                  win_sequence($scope.player2_input, $scope.winning_array);
                }
              }
              else if (!$scope.winner && $scope.moves == 10) {
                $scope.catsgame = true;
                break;
              }
            }
          }
        }
      } 
      //add different colors to win squares
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
    });

;