// JavaScript Document 
// Use with index.php and styles.css

"use strict";

// Establish variables for the group ID and each selection in the group: 
var images = "on"; // use "on" to turn Gallica images on
var groupId; // there are four groups on each page (1- many hundreds)
var selId; // there are seven selections in each group (0-6)
var coordId; // there are ten data points for each selection (0-9)
var URIstring;
var msnum;
var fnum;
var thisFnum;
var getMS;
var getURI;
var getCoords;
var useCoords = {cw:0};
var nowcoords;
var allcoords = [{cw:0},1,2,3,4,5,6];
var latestCoords = new Array(1,2,3);
var getFolioGroups;
var msdata;
var cxywh;
var selArray = [0,1,2,3,4,5,6];
var fullgrid = "on";
var nowsel = 0;
var scale = [4,4,4,4,4,4,4,12];
// console.log("Width: " + useCoords.cw);

var xhr = new XMLHttpRequest();
xhr.open('GET', "json/mss.json", true);
xhr.responseType = 'text';

// Syntax for JSON objects: msdata.group[4].sel[5].coord[6] [group is 1 based; sel is 0 based; coord is 0 based]
// *ONLOAD Function
xhr.onload = function() {
    if(xhr.status === 200) {
        msdata = JSON.parse(xhr.responseText);
        // xhr.responseText contains the raw text of the imported file
        groupId = msdata.ms1[0].done;
        // selId = 1;
        selId = "all";
        thisFnum = "https://gallica.bnf.fr/iiif/ark:/12148/btv1b105325870/f15/full/pct:25/0/native.jpg";
        
        // console.log(msdata.ms1[0].name);
        // console.log(msdata.group[4].sel[5].coord[6]);
        // console.log(msdata.group[groupId].sel[5].coord[6]);
    } // end if
    
    // var mylabel = "BNF FR" + msdata.group[1].sel[0].coord[0] + " folio " + msdata.group[1].sel[0].coord[2];
    // var myTag = "<a href=\"" +thisFnum + "\" target=\"_blank\">" + mylabel + "</a>";
    // document.getElementById("label").innerHTML = myTag; 
    document.getElementById("quadrant").innerHTML = msdata.group[1].sel[0].coord[4];
    
    getMS = selectMS(msdata.group[1].sel[0].coord[0]);
    console.log("Now working on MS. " + msdata.group[1].sel[0].coord[0]);
    console.log("Working with BNF ark: " + getMS);
    
    // returns the URI for this Fnum  
    fnum = msdata.group[groupId].sel[5].coord[1];
        
    thisFnum = selectFnum(getMS,fnum);
    
    updateLabel(thisFnum);
    nowcoords = selectCoordsAll(groupId);
    // console.log("Loading nowcoords: " + nowcoords[0].cset);
    selArray = createWindows(groupId, selId,nowcoords);
    

    
    displayImages(selId,thisFnum,selArray);
    cutWindows(selId,selArray);
    latestCoords = calcCoords(selId,nowcoords);
    
    getFolioGroups = findFolioGroups(groupId);
    console.log("Groups on this page: " + getFolioGroups.A + getFolioGroups.B + getFolioGroups.C + getFolioGroups.D); 
    
    listening();
    
}; // end function

// **Function for listening events
function listening(){
    document.querySelector('#togglems').addEventListener('click', function(){onClicks("togglems");},false);
    document.querySelector('#prevPage').addEventListener('click', function(){onClicks("changepage","-");},false);
    document.querySelector('#nextPage').addEventListener('click', function(){onClicks("changepage","+");},false);
    document.querySelector('#lastDone').addEventListener('click', function(){onClicks("gotolast","last");},false);
    document.querySelector('#Aquad').addEventListener('click', function(){onClicks("changequad",0);},false);
    document.querySelector('#Bquad').addEventListener('click', function(){onClicks("changequad",1);},false);
    document.querySelector('#Cquad').addEventListener('click', function(){onClicks("changequad",2);},false);
    document.querySelector('#Dquad').addEventListener('click', function(){onClicks("changequad",3);},false);
   
    /*    
    document.querySelector('#full').addEventListener('click', function(){onClicks("changesel",0);},false);
    document.querySelector('#top').addEventListener('click', function(){onClicks("changesel",1);},false);
    document.querySelector('#bottom').addEventListener('click', function(){onClicks("changesel",2);},false);
    document.querySelector('#toptext').addEventListener('click', function(){onClicks("changesel",3);},false);
    document.querySelector('#toppic').addEventListener('click', function(){onClicks("changesel",4);},false);
    document.querySelector('#bottomtext').addEventListener('click', function(){onClicks("changesel",5);},false);
    document.querySelector('#bottompic').addEventListener('click', function(){onClicks("changesel",6);},false);
    document.querySelector('#all').addEventListener('click', function(){onClicks("changesel",7);},false);
    */
    
// Event delegation - Click anywhere in <main> and redirect the event.target to the correct function
    var selclass = ["zero","one","two","three","four","five","six","all"];
    var buttonclass = ["left","right","up","down","wider","narrower","taller","shorter","scale","save"];
    var selext;
    var butext;
    document.querySelector('main').addEventListener('click', function(event){
        if (event.target.tagName != 'BUTTON'){
            console.log("Not a button. " + event.target.tagName);
            return;
        }
        console.log(event.target);
        var m = 0;
        while (m < 8){
            if(event.target.matches('.' + selclass[m])){
                selext = m;
            }
            m++;
        }
        var n = 0;
        while (n <= buttonclass.length){
            if(event.target.matches('.' + buttonclass[n])){
                butext = buttonclass[n];
            }
            n++;
        }
        var ext = butext + selext;
        
        var polarity = "";
        if (butext === "right" || butext === "down" || butext === "narrower" || butext === "shorter"){
            polarity = "-";
        }
        
        // nudgers
        if (butext === "left" || butext === "right"){
            onClicks("changepos","x" + selext, polarity + scale[selext]);
        }
        if (butext === "up" || butext === "down"){
            onClicks("changepos","y" + selext, polarity + scale[selext]);
        }
        if (butext === "wider" || butext === "narrower"){
            onClicks("changepos","w" + selext, polarity + scale[selext]);
        }
        if (butext === "taller" || butext === "shorter"){
            onClicks("changepos","h" + selext, polarity + scale[selext]);
        }
        
        // scale
        if (butext === "scale"){
            onClicks("changescale",selext);
        }
        
        // Save
        if (butext === "save"){
            onClicks("save",selext);
        }
    },false);
   
}

// *Function to manage all onClick events
function onClicks(doWhat,param,ext){
    // Check ready state
    if(xhr.readyState === 4) {
        if(xhr.status === 200) {
            console.log("Button pushed? " + doWhat);
            var sendCoords;
            
            // Change Quad
            if (doWhat === "changequad"){
                console.log("Here's the GroupId before changing the quad: " + groupId);
                var newquad = changequad(param); //change quad and get new groupId
                    // returns an object: newquad.groupId = group number; newquad.quadrant = A-D
                groupId = newquad.groupId;
                console.log("Here's the GroupId after changing the quad: " + groupId);
                    
                if (selId === "all"){
                    allcoords = selectCoordsAll(groupId);
                    selArray = createWindows(groupId,selId,allcoords);
                    cutWindows(selId,selArray);
                    
                } else {
                    var newcoord = selectCoords(newquad.groupId,selId); // grab new coordinates
                        // returns an object newcoord.cx .cy .cw .ch .cset
                    // var newuri = createURI(newquad.groupId,selId,newcoord.cset); // send newquad and newcoord to create a new URI --OLD Not usung createURI anymore       
                    // console.log("Different Coords: " + newcoord.cset);
                    // console.log("New URI = " + newuri);
                    // console.log("JSON data: " + msdata.group[4].sel[5].coord[6]);
                    // document.getElementById("desc").innerHTML = newuri;
                    // displayImages(selId,newuri);
                }
            }
        
            // Change Selection   
            if (doWhat === "changesel"){
                var newsel = changesel(param); // change sel and get new selId
                console.log("You have picked Selection #" + newsel);
                selId = newsel;
                
                if (newsel === "all"){
                    selArray = createWindows(groupId,selId,useCoords);
                    cutWindows(selId,selArray);
                } else {
                newcoord = selectCoords(groupId,selId); // grab new coordinates
                    // returns an object newcoord.cx .cy .cw .ch .cset
                    console.log("Here's what's going to the code: " + groupId);
                    console.log("Here's what's going to the code: " + selId);
                    console.log("Here's what's going to the code: " + newcoord.cset);
                selArray = createWindows(groupId,selId,newcoord);
                displayImages(selId,thisFnum);
                cutWindows(selId,selArray);
                /*
                newuri = createURI(groupId,selId,newcoord.cset); // send newquad and newcoord to create a new URI        
                    // console.log("Different Coords: " + newcoord.cset);
                console.log("New URI = " + newuri);
                displayImages(selId,newuri);
                */
                }
                
            }
            
            // Change Coordinates
            if (doWhat === "changepos"){
                //split out variables from "param"
                var whichCo = param.charAt(0); // which coordinate? xywh?
                var whichSel = param.charAt(1); // which selection? (7 = all)
                
                var newposAll; // nudge all buttons
                if (whichSel == 7){
                    console.log("GroupId before nudging: " + groupId);
                    if (allcoords[0].cw === 0){
                        nowcoords = selectCoordsAll(groupId);
                                console.log("If 0 NOWCOORDS: " + nowcoords[0].cset);
                        
                        allcoords = nowcoords;
                                console.log("ALLCOORDS: " + allcoords[0].cset);
                    } else {
                        allcoords = nowcoords;
                                console.log("NOWCOORDS: " + nowcoords[0].cset);
                                console.log("ELSE ALLCOORDS: " + allcoords[0].cset);
                    }
                    newposAll = changeposAll(whichCo,ext,allcoords);
                                console.log("NEWPOSALL = " + newposAll[0].cx);
                    allcoords = newposAll;
                                console.log("THISNEW: " + allcoords[0].cset);
                                
                    selArray = createWindows(groupId,"all",allcoords);
                                console.log(selArray);
                    cutWindows("all",selArray);
                    latestCoords = calcCoords(selId,nowcoords);
                                console.log("LatestCoords = " + latestCoords[0].cx);
                    console.log("GroupId after nudging: " + groupId);
                    return;
                }
                
                var newpos; // nudge individual selections buttons
                if (fullgrid === "on"){
                    if (useCoords.cw === 0){
                        nowcoords = selectCoordsAll(groupId);
                                // console.log("NOWCOORDS: " + nowcoords[0].cset);
                        useCoords = nowcoords[whichSel];
                                // console.log("UseCoords was empty, Now = " + useCoords.cx); 
                    } else {
                        useCoords = nowcoords[whichSel];
                                // console.log("NOWCOORDS: " + nowcoords[0].cset);
                                // console.log("UseCoords is Populated, Now = " + useCoords.cx);
                    }
                    if (allcoords[0].cw !== 0){
                        // console.log("Nowcoords1: " + nowcoords[0].cset);
                        nowcoords = allcoords;
                        // nowcoords = selectCoordsAll(groupId);
                        // console.log("beep Nowcoords: " + nowcoords[0].cset);
                        useCoords = allcoords[whichSel]; 
                        // console.log("useCoords: " + useCoords.cset);
                    }    
                    // console.log("useCoords = " + useCoords.cx);
                    newpos = changepos(whichCo,ext,useCoords);
                                // console.log("NEWPOS = " + newpos.cx);
                    useCoords = newpos;
                                // console.log("THISNEW: " + useCoords.cset);
                                
                    selArray = createWindows(groupId,whichSel,useCoords);
                                // console.log(selArray);
                    cutWindows(whichSel,selArray);
                    latestCoords = calcCoords(selId,nowcoords);
                                // console.log("LatestCoords = " + latestCoords[0].cx);
                }
            }
            
            // Change Scale
            if (doWhat === "changescale"){
                changeScale(param);
            }
            
            // Change Page
            if (doWhat === "changepage"){
                var whichMS = msdata.group[groupId].sel[0].coord[0];
                if (param === "-"){
                    var fnumMin;
                    if (whichMS === 166){
                        fnumMin = 15;
                    }
                    if (whichMS === 167){
                        fnumMin = 9;
                    }
                    if (fnum === fnumMin){
                        alert("Already on the first page.");
                        return;
                    } else {
                    fnum = fnum -1;
                    groupId = getFolioGroups.A -4;
                    console.log("Going back one page: " + whichMS + ", New fNumber: " + fnum);
                    }
                }
                if (param === "+"){
                    var fnumMax;
                    if (whichMS === 166){
                        fnumMax = 22;
                        // fnumMax = 352;
                    }
                    if (whichMS === 167){
                        fnumMax = 649;
                    }
                    if (fnum === fnumMax){
                        alert("Already on the last page.");
                        return;
                    } else {
                    fnum = fnum +1;
                    groupId = getFolioGroups.D +1;
                    console.log("Going forward one page: " + whichMS + ",  New fNumber: " + fnum );
                    }
                }
                getFolioGroups = findFolioGroups(groupId);
                sendCoords = selectCoordsAll(groupId); 
                refreshPage(groupId,"all","A",sendCoords);
                
                console.log("Change quadrant: A" );
                console.log("Groups on this page: " + getFolioGroups.A + ", " + getFolioGroups.B + ", " +  getFolioGroups.C + ", " +  getFolioGroups.D); 
            }
            
            // Save data points
            if (doWhat === "save"){
                if (param === 7){
                    var newJSON;
                    newJSON = saveall(groupId);
                    postall(newJSON);
                    return;
                } 
                if (param <= 6) {
                    console.log("Save selection is deactivated. Use Save All instead.");
                    //savesel(groupId,param); //temp redirect
                    // Function for creating the full JSON file: bigJSON(groupId);
                }
            }
            
            // Go to last saved group
            if (doWhat === "gotolast"){
                // For some reason, the image is not updating to the correct group. Goes to A, but wrong page
                if (msnum === 166){
                    console.log("Last saved group: " + msdata.ms1[0].done);
                    groupId = msdata.ms1[0].done;
                }
                if (msnum === 167){
                    console.log("Last saved group: " + msdata.ms2[0].done);
                    groupId = msdata.ms2[0].done;
                }
                getFolioGroups = findFolioGroups(groupId);
                sendCoords = selectCoordsAll(groupId);
                refreshPage(groupId,"all","A",sendCoords);
            }
            
            // Toggle manuscript
            if (doWhat === "togglems"){
                var currentMS = msdata.group[groupId].sel[0].coord[0];
                if(currentMS === 166){
                    console.log("Now working on MS. 167");
                    getMS = selectMS(167);
                    groupId = 1353; 
                }
                if(currentMS === 167){
                    console.log("Now working on MS. 166");
                    getMS = selectMS(166);
                    groupId = 1; 
                }
                sendCoords = selectCoordsAll(groupId);
                refreshPage(groupId,"all","A",sendCoords);
            }
            
        } else {
            updateError();
        }
    }
} // end function

// *Function to determine which MS we are working with
function selectMS(mscote){
    var URIintro;
    // console.log("Now working on MS. " + mscote);
    // Ms Fr. 166 or Ms Fr. 167?
    if (mscote === 166){
        URIintro = "https://gallica.bnf.fr/iiif/ark:/12148/btv1b105325870/";
        msnum = mscote;
    } else if (mscote === 167){
        URIintro = "https://gallica.bnf.fr/iiif/ark:/12148/btv1b8447300c/";
        msnum = mscote;
    }
    return URIintro;
    
} // end function

// **Function to create URL for current page
function selectFnum(msUri,fnum){
    if (images === "on"){
        var uri = msUri + "f" + fnum + "/full/pct:25/0/native.jpg";
        console.log("MS = " + uri);
    } else {
        uri = "https://jessehurlbut.net/nudger/BNF-FR166-f15x25test.jpg";
    }
    return uri;
} // end function

// **Function to update the page label with a link to the Gallica page
function updateLabel(imgsrc){
    var mylabel = "BNF FR" + msdata.group[groupId].sel[0].coord[0] + " folio " + msdata.group[groupId].sel[0].coord[2];
    var myTag = mylabel + "&nbsp;&nbsp;<a href=\"" + imgsrc + "\" target=\"_blank\"><img src=\"goto_icon.png\" border=\"none\" width=30 height=30 title=\"Open full folio in new tab\"/></a>";
    document.getElementById("label").innerHTML = myTag; 
} // end of function    
    
// *Function to drop xywh coordinates into variables
function selectCoords(gid,sid){
    cxywh = {
    cx : msdata.group[gid].sel[sid].coord[6] * .25,
    cy : msdata.group[gid].sel[sid].coord[7] * .25,
    cw : msdata.group[gid].sel[sid].coord[8] * .25,
    ch : msdata.group[gid].sel[sid].coord[9] * .25,
    cset : msdata.group[gid].sel[sid].coord[6] * .25 + "," + msdata.group[gid].sel[sid].coord[7] * .25 + "," + msdata.group[gid].sel[sid].coord[8] * .25 + "," + msdata.group[gid].sel[sid].coord[9] * .25
    };
    return cxywh;
} // end function

// *Function to drop xywh coordinates into an array for the whole set
function selectCoordsAll(gid){
    var allcoord = new Array(1,2,3);
    var i = 0;
        while (i < 7) {
            allcoord[i] = selectCoords(gid,i); // grab new coordinates
            i++;
        }
    return allcoord;
} // end function

// **Function to create viewport windows into current page: Creates selArray[x].width, .height, .backpos
function createWindows(group,sel,coord){
    var newWin = new Object();
    var mJSON;
    if (sel === "all"){
        var i = 0;
        while (i < 7) {
            newWin = new Object();
            newWin.width = coord[i].cw + "px";
            newWin.height = coord[i].ch + "px"; 
            newWin.backpos = "-" + coord[i].cx + "px -" + coord[i].cy + "px";
            
            selArray[i] = newWin;
            mJSON = JSON.stringify(selArray);
            i++;
        }
        
    } else {
        newWin = new Object();
        newWin.width = coord.cw + "px";
        newWin.height = coord.ch + "px"; 
        newWin.backpos = "-" + coord.cx + "px -" + coord.cy + "px";
        
        selArray[sel] = newWin;
        mJSON = JSON.stringify(selArray);
}
    return selArray;

}

// Function to change coordinates (which coordinate, ) e.g., coo = [xywh]; ext = [50, -50]; coord = current coords[]
function changepos(coo,ext,coord){ 
    
    if (coo === "x"){
        //console.log("CX Before: " + coord.cx);
        coord.cx = coord.cx + Number(ext);
        //console.log("CX After: " + coord.cx);
    }
    if (coo === "y"){
        coord.cy = coord.cy + Number(ext);
    }
    if (coo === "w"){
        coord.cw = coord.cw + Number(ext);
    }
    if (coo === "h"){
        coord.ch = coord.ch + Number(ext);
    }
    
    coord.cset = coord.cx + "," + coord.cy + "," + coord.cw + "," + coord.ch;
    
    return coord;
}

// Function to change coordinates (which coordinate, ) for all selections, e.g., coo = [xywh]; ext = [50, -50]; coord = current coords[]
function changeposAll(coo,ext,coords){ 
    // called by using: newposAll = changeposAll(whichCo,ext,nowcoords);
    var u = 0;
    while (u < 7){
        if (coo === "x"){
            // console.log("CX Before: " + coords[u].cx);
            coords[u].cx = coords[u].cx + Number(ext);
            // console.log("CX After: " + coords[u].cx);
        }
        if (coo === "y"){
            coords[u].cy = coords[u].cy + Number(ext);
        }
        if (coo === "w"){
            coords[u].cw = coords[u].cw + Number(ext);
        }
        if (coo === "h"){
            coords[u].ch = coords[u].ch + Number(ext);
        }
        coords[u].cset = coords[u].cx + "," + coords[u].cy + "," + coords[u].cw + "," + coords[u].ch;
        u++
    }
    return coords;
}

// **Function to toggle the scale of nudging
function changeScale(sid){
    if (scale[sid] === 4){
    scale[sid] = 12; 
    document.getElementById("scale-" + sid).innerHTML = "Scale: 12";
    return;
    }
    if (scale[sid] === 12){
    scale[sid] = 4; 
    document.getElementById("scale-" + sid).innerHTML = "Scale: 04";
    return;
    }
} // end function

// *Function to change quadrant (A - D; x = 0-3)
function changequad(x){
    var quadGroup;
    var qq = ["A","B","C","D"];
   
    if (qq[x] === "A"){
        quadGroup = getFolioGroups.A;
        // console.log("Page Group: " + quadGroup);
    }if (qq[x] === "B"){
        quadGroup = getFolioGroups.B;
        // console.log("Page Group: " + quadGroup);
    }if (qq[x] === "C"){
        quadGroup = getFolioGroups.C;
        // console.log("Page Group: " + quadGroup);
    }
    if (qq[x] === "D"){
        quadGroup = getFolioGroups.D;
        // console.log("Page Group: " + quadGroup);
    }
    
    document.getElementById("quadrant").innerHTML = qq[x];    
    console.log("Change quadrant: " + qq[x] ); 
    
    var quadInfo = {
        groupId: quadGroup,
        quadrant: qq[x]
    }
    
    return quadInfo; 
    
} // end function

// *Function to change the selection (0 - 6) Which portion(s) of the group to show
function changesel(x){
    var newSel = x;
    if (x === 7){
        // Turn off the single-select grid; turn on the full grid
        document.getElementById("grid-container-sel").style.display = "none";
        document.getElementById("grid-container-all").style.display = "inline-grid";
        fullgrid = "on";
        newSel = "all";
    } else {
        // Turn off the full grid; turn on the single-selection grid
        document.getElementById("grid-container-all").style.display = "none";
        document.getElementById("grid-container-sel").style.display = "inline-grid";
        fullgrid = "off";
        
        // If changesel has been used before, need to reset the IDs to x
        var c = 0;
        while (c < 7){
            var checkId = document.getElementById("selinphoto" + c);
            if (typeof(checkId) !== 'undefined' && checkId !== null){
                document.getElementById("selinphoto" + c).id = "selinphotox";
                document.getElementById("selleft-" + c).id = "selleft-x";
                document.getElementById("selright-" + c).id = "selright-x";
                document.getElementById("selup-" + c).id = "selup-x";
                document.getElementById("seldown-" + c).id = "seldown-x";
                document.getElementById("selwider-" + c).id = "selwider-x";
                document.getElementById("selnarrower-" + c).id = "selnarrower-x";
                document.getElementById("seltaller-" + c).id = "seltaller-x";
                document.getElementById("selshorter-" + c).id = "selshorter-x";
                document.getElementById("selsave-" + c).id = "selsave-x";
                // console.log("Found it: " + c);
            } else {
                // console.log("Not " + c);
            }
            c++;
        }
        // Convert button ids to the chosen selection
        document.getElementById("selinphotox").id = "selinphoto" + x; 
        document.getElementById("selleft-x").id = "selleft-" + x;
        document.getElementById("selright-x").id = "selright-" + x;
        document.getElementById("selup-x").id = "selup-" + x;
        document.getElementById("seldown-x").id = "seldown-" + x;
        document.getElementById("selwider-x").id = "selwider-" + x;
        document.getElementById("selnarrower-x").id = "selnarrower-" + x;
        document.getElementById("seltaller-x").id = "seltaller-" + x;
        document.getElementById("selshorter-x").id = "selshorter-" + x;
        document.getElementById("selsave-x").id = "selsave-" + x;
        
        newSel = x;
    }
    return newSel;
}

// *Function to determine which groups have quadrants from the same page [4 groups per page]
function findFolioGroups(x){
    var thisPage = new Object();
    var max = x+4;
    var thisfnum = msdata.group[x].sel[0].coord[1];
    x = x-4;
    while(x <= max){
        if (x > 0 && x < (msdata.group.length)){
            var thatfnum = msdata.group[x].sel[0].coord[1]; 
    
            if (thatfnum === thisfnum){
                if (msdata.group[x].sel[0].coord[4] === "A"){
                   thisPage.A = x; 
                }
                if (msdata.group[x].sel[0].coord[4] === "B"){
                   thisPage.B = x; 
                }
                if (msdata.group[x].sel[0].coord[4] === "C"){
                   thisPage.C = x; 
                }
                if (msdata.group[x].sel[0].coord[4] === "D"){
                   thisPage.D = x; 
                }
            }
        }    
        x++;
    }
    return thisPage;
} // end function

// *Function to display the images on the page
function displayImages(sel,img){
    if (sel ==="all"){
            var i = 0;
            while (i < 7) {
                document.getElementById("inphoto" + i).style.background = "url(" + img + ")";
                i++;
            }
        } else {
            var b = 0;
            while (b < 7){
                if (b === sel){
                    document.getElementById("selinphoto" + sel).style.background = "url(" + img + ")";
                } else {
                    // document.getElementById("selinphoto" + b).style.background = "url(img_trans.gif)";
                    // document.getElementById("selinphoto" + b).style.height = "10px"; 
                }
                b++;
            }
        }
}

// **This Function assumes the image is already loaded and will cut the windows using the correct coordinatas for each selection
function cutWindows(sel,coord){
    var mJSON = JSON.stringify(coord);
    // console.log(mJSON);
    // console.log("Cut Window Sel: " + sel);
    
    if (sel === "all" || fullgrid === "on"){
        var i = 0;
        while (i < 7) {
            document.getElementById("inphoto" + i).style.width = coord[i].width; 
            document.getElementById("inphoto" + i).style.height = coord[i].height;
            document.getElementById("inphoto" + i).style.backgroundPosition = coord[i].backpos;
            // document.getElementById("inphoto" + i).style.backgroundSize = "10vw";
            document.getElementById("inphoto" + i).style.backgroundRepeat = "no-repeat";
            i++;
        }
    } else {
        console.log("New window coords: " + sel + " - " + coord[sel].width + ", " + coord[sel].height + ", " + coord[sel].backpos);
        document.getElementById("selinphoto" + sel).style.width = coord[sel].width; 
        document.getElementById("selinphoto" + sel).style.height = coord[sel].height;
        document.getElementById("selinphoto" + sel).style.backgroundPosition = coord[sel].backpos;
        document.getElementById("selinphoto" + sel).style.backgroundRepeat = "no-repeat";
    }
} // end of function

// **This function reloads the page with the lated group, sel, quad, coords
function refreshPage(gid,sel,quad,coords){
    document.getElementById("quadrant").innerHTML = msdata.group[gid].sel[0].coord[4];
    fnum = msdata.group[groupId].sel[5].coord[1];
    thisFnum = selectFnum(getMS,fnum);
    updateLabel(thisFnum);
    allcoords = selectCoordsAll(gid);
    selArray = createWindows(gid,sel,allcoords);
    displayImages(sel,thisFnum);
    cutWindows(sel,selArray);    
}
    
// **Function for calculating and displaying latest coordinates
function calcCoords(sel,coord){
   var mJSON = JSON.stringify(coord); 
   if (sel === "all" || fullgrid === "on"){
        var fullcoord = new Array(1,2,3);
        var fcxywh;
        var p = 0;

        while (p < 7) {
            fcxywh={
                cx: coord[p].cx / '.25',
                cy: coord[p].cy / '.25',
                cw: coord[p].cw / '.25',
                ch: coord[p].ch / '.25',
            };
            var tempcset = fcxywh.cx + "," + fcxywh.cy + "," + fcxywh.cw + "," + fcxywh.ch;
            fcxywh.cset = tempcset;
            
            fullcoord[p] = fcxywh;
          
            document.getElementById("incoords" + p).innerHTML = fullcoord[p].cset;
            
            latestCoords[p] = fullcoord[p];
            p++;
        }

        return latestCoords;
    }
} // end of function

// **Function to save all coords in a quad
function saveall(gid){
    // JDH - currently, any ALL Changes are getting recorded, but the SEL changes are not. 
    console.log("Saving all of Group: " + latestCoords[2].cx);
    
    var seldata;
    var g = 0;
    var gup;
    var str1 = ",\n{\"sel\" :\n[ \n";
    var str2 = "{\"coord\": ["
    var str3 = msnum + "," + fnum + ",";
    var str4 = '"' + msdata.group[gid].sel[0].coord[2] + '",' + msdata.group[gid].sel[0].coord[3] + ",";
    var str5 = '"' + msdata.group[gid].sel[0].coord[4] + '",';
    var str6 = "]}";
    var str7 = ",\n";
    var str8 = "\n]}";
    
    seldata = str1;
    while (g <= 6){
        gup = g+1 + ",";
        seldata = seldata.concat(str2, str3, str4, str5, gup, latestCoords[g].cset, str6);
        if (g < 6){
            seldata = seldata.concat(str7);
        }
        g++;
    }
    seldata = seldata.concat(str8);
    
    var v=0;
    while (v<=6){
    msdata.group[gid].sel[v].coord[6] = latestCoords[v].cx;
    msdata.group[gid].sel[v].coord[7] = latestCoords[v].cy;
    msdata.group[gid].sel[v].coord[8] = latestCoords[v].cw;
    msdata.group[gid].sel[v].coord[9] = latestCoords[v].ch;
    v++;
    }
    // Change the Last Done id in JSON
    var currentMS = msdata.group[groupId].sel[0].coord[0];
               
    if(currentMS === 166){
        msdata.ms1[0].done = gid; 
    }
    if(currentMS === 167){
        msdata.ms2[0].done = gid; 
    }
    var newJSON = JSON.stringify(msdata);
    console.log("DATA: " + xhr.responseText + newJSON);
    /*
    var buildData="{\"sel\" :\n
        [ \n
        {"coord": [166,15,"1r",1,"A",1,334,705,1828,2284]},\n
        {"coord": [166,15,"1r",1,"A",2,334,705,1828,1144]},
        {"coord": [166,15,"1r",1,"A",3,334,1820,1838,1169]},
        {"coord": [166,15,"1r",1,"A",4,334,700,1023,1144]},
        {"coord": [166,15,"1r",1,"A",5,1286,700,891,1144]},
        {"coord": [166,15,"1r",1,"A",6,344,1815,997,1175]},
        {"coord": [166,15,"1r",1,"A",7,1250,1815,931,1175]}
        ]},\n"
    */
    document.getElementById("newJSON").innerHTML = newJSON;
    // document.getElementById("newJSONform").value = latestCoords[0];
    
    return newJSON;
}

// **Function to save new data to json file
function postall(newJSON){  
    
    // need to add jQuery
    $.ajax({
      method: "POST",
      url: "https://jessehurlbut.net/nudger/nudgersave.php",
      data: { data: newJSON }
    })
      .done(function( msg ) {
        alert( "Data Saved");
      });
} // end function

// **Function to save coords for ONE selection in a quad
function savesel(gid,sel){
    console.log("You want to save sel: " + sel + " of Group: " + gid);
}

// *Error function: Out of Scope
function updateError(){
    document.getElementById("quadrant").innerHTML = "Error: Out of scope"; 
} // end function

// ***Function to create a big JSON file of MS 166
function bigJSON(){
    /*
    // MS 166
    var JSONbig = "@";
    var folbig = 1;
    var quadbig = ["A","B","C","D"];
    var sub = 0; // this is the key to the quadbig array
    var str1 = '{"sel" : [';
    var str2 = '{"coord": [166,';
    
    var strLast = ']},';
    
    var gidbig = 1;
    var rv = "r";
    var a = 15;
    var b = 1;
    var x = b-1;
    
    while (a < 353){ // folio loop
        sub = 0;
        while (sub < 4){ // quad loop
            var latestCoordsbig = getCoordsBig(rv,quadbig[sub]); // call the function that gets the coordinates
  
            JSONbig = JSONbig.concat(str1);
            while (b < 8){ // selection loop
                x = b-1;
                JSONbig = JSONbig.concat(str2, a, ',"', folbig, rv, '",', gidbig, ',"', quadbig[sub], '",', b , ',', latestCoordsbig[x].cset,"]}");
                if (b != 7){
                    JSONbig = JSONbig.concat(",");
                }
                b++;
            }
            JSONbig = JSONbig.concat(strLast);
            b = 1;
            gidbig++;

            sub++;
        }
        a++;
        
        if (rv === "r"){
            rv = "v";
        } else {
            rv = "r";
            folbig++;
        }
    }
    // console.log("LatestCoordsBig = " + latestCoordsbig[0].cset);
        
    console.log(JSONbig);
document.getElementById("newJSON").innerHTML = JSONbig;
*/
// MS 167
    var JSONbig = "@";
    var folbig = 1;
    var quadbig = ["A","B","C","D"];
    var sub = 0; // this is the key to the quadbig array
    var str1 = '{"sel" : [';
    var str2 = '{"coord": [167,';
    
    var strLast = ']},';
    
    var gidbig = 1353;
    var rv = "r";
    var a = 9;
    var b = 1;
    var x = b-1;
    
    while (a < 650){ // folio loop
        sub = 0;
        while (sub < 4){ // quad loop
            var latestCoordsbig = getCoordsBig(rv,quadbig[sub]); // call the function that gets the coordinates
  
            JSONbig = JSONbig.concat(str1);
            while (b < 8){ // selection loop
                x = b-1;
                JSONbig = JSONbig.concat(str2, a, ',"', folbig, rv, '",', gidbig, ',"', quadbig[sub], '",', b , ',', latestCoordsbig[x].cset,"]}");
                if (b != 7){
                    JSONbig = JSONbig.concat(",");
                }
                b++;
            }
            JSONbig = JSONbig.concat(strLast);
            b = 1;
            gidbig++;

            sub++;
        }
        a++;
        
        if (rv === "r"){
            rv = "v";
        } else {
            rv = "r";
            folbig++;
        }
    }
    // console.log("LatestCoordsBig = " + latestCoordsbig[0].cset);
        
    console.log(JSONbig);
document.getElementById("newJSON").innerHTML = JSONbig;

}

// ***Function to get coords for each quad of rectos and versos - called only from bigJSON function
function getCoordsBig(rv,quad){
    var getCoordsbig;
    var getquad;
        
    if (rv === "r"){
        if (quad === "A"){
            // getquad = 1; //ms 166
            getquad = 1353; //ms 167
        }
        if (quad === "B"){
            // getquad = 2; //ms 166
            getquad = 1354; //ms 167
        }
        if (quad === "C"){
            // getquad = 3; //ms 166
            getquad = 1355; //ms 167
        }
        if (quad === "D"){
            // getquad = 4; //ms 166
            getquad = 1356; //ms 167
        }
    }
    if (rv === "v"){
        if (quad === "A"){
            // getquad = 5; //ms 166
            getquad = 1357; //ms 167
        }
        if (quad === "B"){
            // getquad = 6; //ms 166
            getquad = 1358; //ms 167
        }
        if (quad === "C"){
            // getquad = 7; //ms 166
            getquad = 1359; //ms 167
        }
        if (quad === "D"){
            // getquad = 8; //ms 166
            getquad = 1360; //ms 167
        }
    }
    getCoordsbig = selectCoordsAllbig(getquad);
        
        // console.log("getCoordsbig = " + getCoordsbig[0].cset);
        // return getCoordsbig;
        return getCoordsbig;
}

// ***Function to drop xywh coordinates into variables - called only from bigJSON function
function selectCoordsbig(gid,sid){
    cxywh = {
    cx : msdata.group[gid].sel[sid].coord[6],
    cy : msdata.group[gid].sel[sid].coord[7],
    cw : msdata.group[gid].sel[sid].coord[8],
    ch : msdata.group[gid].sel[sid].coord[9],
    cset : msdata.group[gid].sel[sid].coord[6] + "," + msdata.group[gid].sel[sid].coord[7] + "," + msdata.group[gid].sel[sid].coord[8] + "," + msdata.group[gid].sel[sid].coord[9]
    };
    return cxywh;
} // end function

// ***Function to drop xywh coordinates into an array for the whole set - called only from bigJSON function
function selectCoordsAllbig(gid){
    var allcoord = new Array(1,2,3);
    var i = 0;
        while (i < 7) {
            allcoord[i] = selectCoordsbig(gid,i); // grab new coordinates
            i++;
        }
    return allcoord;
} // end function

/*
// Function to create image URIs
function createURI(group,sel,coord){
    URIstring = getMS + "f" + msdata.group[groupId].sel[sel].coord[1] + "/" + coord + "/pct:25/0/native.jpg";
    // console.log(msdata.group[groupId].sel[5].coord[6]);
    return URIstring;
} // end function

// Function to create image URIs for all Selections
function createURIall(group){
    var i = 0;
    while (i < 7) {
        var newcoord = selectCoords(group,i); // grab new coordinates
            // returns an object newcoord.cx .cy .cw .ch .cset
        var newuri = createURI(group,i,newcoord.cset); // send newquad and newcoord to create a new URI        
            // console.log("Different Coords: " + newcoord.cset);
            //console.log("New URI = " + newuri);
        
        selArray[i] = newuri;
        i++;
    }
    return selArray;
} // end function
*/

xhr.send();
