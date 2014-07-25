var TTTApp = angular.module('TTTApp', ['firebase']);
      TTTApp.controller("cubeController", ["$scope", "$firebase",
  function($scope, $firebase) {

    // var TTTRef = new Firebase("https://initialtictac.firebaseIO.com");

    // $scope.clickCounter = $firebase(new Firebase("https://initialtictac.firebaseIO.com" + '/clickCounter'));

    // $scope.remoteCellList = 
    // $firebase(new Firebase("https://initialtictac.firebaseIO.com" + '/remoteCellList')) ;

    // $scope.clickCount = 0 ;

    //   $scope.remoteCellList.$bind($scope, "cellz");
    // $scope.$watch('cellz', function() {
    //   console.log('Model changed!') ;
    // }) ;

    $scope.dropSuccessHandler = function(event, index, array) {
    console.log(array);
    alert('sup!');
  };

  $scope.onDrop = function(event, data, array) {
    array.push(data);
    console.log(array);
  };

  $scope.test = function() { alert('test test test'); };

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

        $scope.cellz = [
          {idee:0, owner:null, win:null},
          {idee:1, owner:null, win:null},
          {idee:2, owner:null, win:null},
          {idee:3, owner:null, win:null},
          {idee:4, owner:null, win:null},
          {idee:5, owner:null, win:null},
          {idee:6, owner:null, win:null},
          {idee:7, owner:null, win:null},
          {idee:8, owner:null, win:null}];

  

        $scope.moves = 1; //no moves made (initialize at 1 so player 1 is odd / player 2 is even)
        $scope.player1_moves=0;
        $scope.player2_moves=0; 
        $scope.player = "Start";
        $scope.p_number = ""; //player is undefined initially
        $scope.results = ['','','','','','','','',''];
        $scope.winner = ""
        $scope.catsgame = ""
        $scope.winner_declared= false;
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
      //   ev.preventDefault();
      // var data = ev.dataTransfer.getData("Text");
      // ev.target.appendChild(document.getElementById(data));
      //   var rect = document.getElementById("tile"+cell.idee).getBoundingClientRect();

        // console.log(rect);
        console.log("test");
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
          }
        // $scope.p1p2 = $scope.results[box];

           if ($scope.moves>5){
            $scope.winner_declared = false;
            for (var i = 0; i < winCombos.length; i++){ //win logic
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

// .directive("drag", ["$document", function($document){
//     return function(s, e, attr){
//       var start_x = 0,
//           start_y = 0,
//           x = 0,
//           y = 0;

//       e.css({
//         position: "relative",
//         backgroundColor: 'yellow',
//         padding: "10px",
//         pointerevents: "inherit"
//       });

//       e.on("mousedown", function(event){
//         console.log(event);
//         event.preventDefault();
//         start_x = event.pageX - x;
//         start_y = event.pageY - y;
//         $document.on("mousemove", mousemove);
//         $document.on("mouseup", mouseup);
//       });

//       function mousemove(event) {
//         x = event.pageX - start_x;
//         y = event.pageY - start_y;
//         e.css({
//           top: y + "px",
//           left: x + "px"
//         });
//       }

//       function mouseup(event) {
//         $document.off("mousemove", mousemove);
//         $document.off("mouseup", mouseup);
//         // $scope.simulate(document.getElementById("grid"), "click", { pointerX: 123, pointerY: 321 });
//         console.log(event);
//       }

//     }

// }])
;