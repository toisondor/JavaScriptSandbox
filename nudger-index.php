<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>Bible Moralis&eacute;e - Nudger</title>

<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<link href="css/styles.css" rel="stylesheet" type="text/css">

<?php
    // This version will do away with the onclick buttons. Let's keep HTML and JS separate. 
?> 
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
</head>

<body>
    
    <div id="headerWrapper">
    <header>
        <h1>Bible Moralis&eacute;e - Nudger</h1>
        <h2>Get the images in just the right place</h2>
        <h3>By Jesse Hurlbut </h3>
    </header>
    </div>

    <div id="navWrapper">
        <nav>
            <button id="togglems">Change MS</button>
            <button id="lastDone">Last Done</button>
            <button id="prevPage">Previous Page</button>
            <button id="nextPage">Next Page</button>
            <button id="Aquad">A</button>
            <button id="Bquad">B</button>
            <button id="Cquad">C</button>
            <button id="Dquad">D</button>
        </nav>
        <div class="keepOpen"></div>
    </div> 
  
  <?php
  /*
    <div id="selNav">
        <button id="all">All</button>
        <button id="full">Full Group</button>
        <button id="top">Top</button>
        <button id="bottom">Bottom</button>
        <button id="toptext">Top Text</button>
        <button id="toppic">Top Picture</button>
        <button id="bottomtext">Bottom Text</button>
        <button id="bottompic">Bottom Picture</button>
    </div>
  */
  ?>
    <main>
        <h1 id="label">
            BNF Fr166, fol. 1r
        </h1>
        <h2 id=quadrant>Aa</h2>
    
        <p id="desc"> </p>
    
        <?php
            // Copied from: https://www.w3schools.com/cssref/tryit.asp?filename=trycss_grid-template3
        ?>

<div id="grid-container-all">
    <div class="item1">All: 
        <button class="left all" id="left-all">Left</button> 
        <button class="right all" id="right-all">Right</button> 
        <button class="up all" id="up-all">Up</button> 
        <button class="down all" id="down-all">Down</button> 
        <button class="save all" id="save-all">Save All</button>
            <?php
            /*
            <form>
                <input action="https://jessehurlbut.net/nudger/nudgersave.php" method="POST" type="text" id="newJSONform" name="newJSONform" size="15"></input>
                <input type="submit"></input>
            </form>
            */
            ?>
            <textarea id="newJSON" rows="1" cols="15"></textarea>
            
    </div>
  <div class="item2">
      <div id="inphoto0"><img src="img_trans.gif" width="1" height="1"></div>
      <div id="incoords0">Testing</div>
  </div>
  <div class="item3">
      <div id="inphoto1"><img src="img_trans.gif" width="1" height="1"></div>
      <div id="incoords1"></div>
  </div>  
  <div class="item4">
      <div id="inphoto2"><img src="img_trans.gif" width="1" height="1"></div> 
      <div id="incoords2"></div>
  </div>
  <div class="item5">
      <div id="inphoto3"><img src="img_trans.gif" width="1" height="1"></div>
      <div id="incoords3"></div>
  </div>
  <div class="item6">
      <div id="inphoto4"><img src="img_trans.gif" width="1" height="1"></div>
      <div id="incoords4"></div>
  </div>
  <div class="item7">
      <div id="inphoto5"><img src="img_trans.gif" width="1" height="1"></div>
      <div id="incoords5"></div>
  </div>
  <div class="item8">
      <div id="inphoto6"><img src="img_trans.gif" width="1" height="1"></div>
      <div id="incoords6"></div>
  </div>
  
  <div class="item9">
      <ctrl>
          <table align=right>
              <tr>
                  <td><button class="left zero" id="left-0">Left</button></td>
                  <td><button class="right zero" id="right-0">Right</button></td>
              </tr>
              <tr>
                  <td><button class="up zero" id="up-0">Up</button></td>
                  <td><button class="down zero" id="down-0">Down</button></td>
              </tr>
              <tr>
                  <td><button class="wider zero" id="wider-0">Wider</button></td>
                  <td><button class="narrower zero" id="narrower-0">Narrower</button></td>
              </tr>
              <tr>
                  <td><button class="taller zero" id="taller-0">Taller</button></td>
                  <td><button class="shorter zero" id="shorter-0">Shorter</button></td>
              </tr>
              <tr>
                  <td><button class="scale zero" id="scale-0">Scale: 4</button></td>
              </tr>
              
              <tr>
                  <td><button class="save zero" id="save-0">Save</button></td>
              </tr>
            </table>
        </ctrl>
      </div>
  <div class="item10"><ctrl>
          <table align=right>
              <tr>
                  <td><button class="left one" id="left-1">Left</button></td>
                  <td><button class="right one" id="right-1">Right</button></td>
              </tr>
              <tr>
                  <td><button class="up one" id="up-1">Up</button></td>
                  <td><button class="down one" id="down-1">Down</button></td>
              </tr>
              <tr>
                  <td><button class="wider one" id="wider-1">Wider</button></td>
                  <td><button class="narrower one" id="narrower-1">Narrower</button></td>
              </tr>
              <tr>
                  <td><button class="taller one" id="taller-1">Taller</button></td>
                  <td><button class="shorter one" id="shorter-1">Shorter</button></td>
              </tr>
              <tr>
                  <td><button class="scale one" id="scale-1">Scale: 4</button></td>
              </tr>
              <tr>
                  <td><button class="save one" id="save-1">Save</button></td>
              </tr>
            </table>
        </ctrl>
      </div>
  <div class="item11"><ctrl>
          <table align=right>
              <tr>
                  <td><button class="left two" id="left-2">Left</button></td>
                  <td><button class="right two" id="right-2">Right</button></td>
              </tr>
              <tr>
                  <td><button class="up two" id="up-2">Up</button></td>
                  <td><button class="down two" id="down-2">Down</button></td>
              </tr>
              <tr>
                  <td><button class="wider two" id="wider-2">Wider</button></td>
                  <td><button class="narrower two" id="narrower-2">Narrower</button></td>
              </tr>
              <tr>
                  <td><button class="taller two" id="taller-2">Taller</button></td>
                  <td><button class="shorter two" id="shorter-2">Shorter</button></td>
              </tr>
              <tr>
                  <td><button class="scale two" id="scale-2">Scale: 4</button></td>
              </tr>
              <tr>
                  <td><button class="save two" id="save-2">Save</button></td>
              </tr>
            </table>
        </ctrl>
      </div>
  <div class="item12"><ctrl>
          <table align=right>
              <tr>
                  <td><button class="left three" id="left-3">Left</button></td>
                  <td><button class="right three" id="right-3">Right</button></td>
              </tr>
              <tr>
                  <td><button class="up three" id="up-3">Up</button></td>
                  <td><button class="down three" id="down-3">Down</button></td>
              </tr>
              <tr>
                  <td><button class="wider three" id="wider-3">Wider</button></td>
                  <td><button class="narrower three" id="narrower-3">Narrower</button></td>
              </tr>
              <tr>
                  <td><button class="taller three" id="taller-3">Taller</button></td>
                  <td><button class="shorter three" id="shorter-3">Shorter</button></td>
              </tr>
              <tr>
                  <td><button class="scale three" id="scale-3">Scale: 4</button></td>
              </tr>
              <tr>
                  <td><button class="save three" id="save-3">Save</button></td>
              </tr>
            </table>
        </ctrl>
      </div>
  <div class="item13"><ctrl>
          <table align=right>
              <tr>
                  <td><button class="left four" id="left-4">Left</button></td>
                  <td><button class="right four" id="right-4">Right</button></td>
              </tr>
              <tr>
                  <td><button class="up four" id="up-4">Up</button></td>
                  <td><button class="down four" id="down-4">Down</button></td>
              </tr>
              <tr>
                  <td><button class="wider four" id="wider-4">Wider</button></td>
                  <td><button class="narrower four" id="narrower-4">Narrower</button></td>
              </tr>
              <tr>
                  <td><button class="taller four" id="taller-4">Taller</button></td>
                  <td><button class="shorter four" id="shorter-4">Shorter</button></td>
              </tr>
              <tr>
                  <td><button class="scale four" id="scale-4">Scale: 4</button></td>
              </tr>
              <tr>
                  <td><button class="save four" id="save-4">Save</button></td>
              </tr>
            </table>
        </ctrl>
      </div>
  <div class="item14"><ctrl>
          <table align=right>
              <tr>
                  <td><button class="left five" id="left-5">Left</button></td>
                  <td><button class="right five" id="right-5">Right</button></td>
              </tr>
              <tr>
                  <td><button class="up five" id="up-5">Up</button></td>
                  <td><button class="down five" id="down-5">Down</button></td>
              </tr>
              <tr>
                  <td><button class="wider five" id="wider-5">Wider</button></td>
                  <td><button class="narrower five" id="narrower-5">Narrower</button></td>
              </tr>
              <tr>
                  <td><button class="taller five" id="taller-5">Taller</button></td>
                  <td><button class="shorter five" id="shorter-5">Shorter</button></td>
              </tr>
              <tr>
                  <td><button class="scale five" id="scale-5">Scale: 4</button></td>
              </tr>
              <tr>
                  <td><button class="save five" id="save-5">Save</button></td>
              </tr>
            </table>
        </ctrl>
      </div>
  <div class="item15"><ctrl>
          <table align=right>
              <tr>
                  <td><button class="left six" id="left-6">Left</button></td>
                  <td><button class="right six" id="right-6">Right</button></td>
              </tr>
              <tr>
                  <td><button class="up six" id="up-6">Up</button></td>
                  <td><button class="down six" id="down-6">Down</button></td>
              </tr>
              <tr>
                  <td><button class="wider six" id="wider-6">Wider</button></td>
                  <td><button class="narrower six" id="narrower-6">Narrower</button></td>
              </tr>
              <tr>
                  <td><button class="taller six" id="taller-6">Taller</button></td>
                  <td><button class="shorter six" id="shorter-6">Shorter</button></td>
              </tr>
              <tr>
                  <td><button class="scale six" id="scale-6">Scale: 4</button></td>
              </tr>
              <tr>
                  <td><button class="save six" id="save-6">Save</button></td>
              </tr>
            </table>
        </ctrl>
      </div>
</div> <!–– end grid-container-all ––>

<div id="grid-container-sel"> 
    <div class="item16">
      <div id="selinphotox"><img src="img_trans.gif" width="1" height="1"></div>
  </div> 
    <div class="item17"><ctrl>
      <table align=right>
          <tr>
              <td><button class="left ex" id="selleft-x">Left</button></td> 
              <td><button class="right ex" id="selright-x">Right</button></td>
          </tr>
          <tr>
              <td><button class="up ex" id="selup-x">Up</button></td>
              <td><button class="down ex" id="seldown-x">Down</button></td>
          </tr>
          <tr>
              <td><button class="wider ex" id="selwider-x">Wider</button></td>
              <td><button class="narrower ex" id="selnarrower-x">Narrower</button></td>
          </tr>
          <tr>
              <td><button class="taller ex" id="seltaller-x">Taller</button></td>
              <td><button class="shorter ex" id="selshorter-x">Shorter</button></td>
          </tr>
          <tr>
              <td><button class="save ex" id="selsave-x">Save</button></td>
          </tr>
        </table>
    </ctrl>
  </div>

</div> <!–– end grid-container-sel ––>

    </main>
    <div id="footerWrapper">
        <footer><p>&copy;2019, Jesse Hurlbut &bull; Nudger</p></footer>
    </div>


<script type="text/javascript" src="js/nudger.js"></script>

</body>

</html>
