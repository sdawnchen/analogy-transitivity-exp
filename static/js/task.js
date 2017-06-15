/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
    "instructions/instructions1.html",
    "trial.html",
    "attn-check-trial.html",
    "saving-results.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
    "instructions/instructions1.html",
];


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/


function AnalogyTransitivityExp() {
    var stim = realQs[condition];
    analogies = _.shuffle(stim.concat(fillerQs));
    attnCheckQs = _.shuffle(attnCheckQs);

    var numAnalogies = analogies.length;
    var numAttnChecks = attnCheckQs.length;
    var numTotalQs = numAnalogies + numAttnChecks;
    var numQsBtwnChecks = numAnalogies / numAttnChecks;

    var trial = 0;
    var checki = 0;
    var attnCheckTrial = false;

    var sliderHandle = "#sim-rating-bar .slider-handle";
    var sliderClicked = false;

    function removeSliderTicks() {
        $("#sim-rating-bar .slider-tick.in-selection").removeClass("in-selection");
    }

    function nextTrial() {
        // Show the analogy
        if (!attnCheckTrial)
            analogy = analogies[trial];
        else {
            analogy = attnCheckQs[checki];
            // Change the requested rating for an attention check
            if (analogy[1][1] == "four")
                $("#requested-rating").html("7 (very good)");
            else
                $("#requested-rating").html("1 (very bad)");
        }

        wordA = analogy[0][0];
        wordB = analogy[0][1];
        wordC = analogy[1][0];
        wordD = analogy[1][1];

        $('#wordA').html(wordA);
        $('#wordB').html(wordB);
        $('#wordC').html(wordC);
        $('#wordD').html(wordD);

        // Update the progress bar
        var progress = Math.round((trial + checki) / numTotalQs * 100);
        $('#progress-bar-text').html(progress + "% Complete");
        $('#progress-bar').attr({
            "aria-valuenow": progress,
            style: "width:" + progress + "%"
        });

        // Reset the slider's value to 1
        ratingSlider.setValue(1);

        // Make the slider handle invisible
        $(sliderHandle).css("visibility", "hidden");
        removeSliderTicks();
        sliderClicked = false;

        // Disable the submit button
        $("#submit").addClass("disabled");
        $("#submit").off("click");
        $("#submit").attr("title", "Please select a rating first.");

        // Record the starting time
        startTime = new Date().getTime();
    }

    function submit() {
        var endTime = new Date().getTime();
        var RT = endTime - startTime;
        var rating = ratingSlider.getValue();

        // If this was an attention check trial, change the page to a normal trial
        // and re-register the slider
        if (attnCheckTrial) {
            psiTurk.recordTrialData({"trial_type": "attention check",
                                     "A": wordA,
                                     "B": wordB,
                                     "C": wordC,
                                     "D": wordD,
                                     "rating": rating,
                                     "RT": RT});
            psiTurk.saveData();

            checki++;

            if (trial < numAnalogies) {
                attnCheckTrial = false;
                psiTurk.showPage("trial.html");

                // Register the slider and its event handler
                ratingSlider = new Slider("#rating-bar");
                ratingSlider.on("slideStop", sliderClickHandler);

                nextTrial();
            } else
                finish();
        
        } else {
            if (wordA == "class" || wordA == "mall" || wordA == "beverage" || wordA == "slavery")
                trial_type = "filler";
            else
                trial_type = "real";

            psiTurk.recordTrialData({"trial_type": trial_type,
                                     "A": wordA,
                                     "B": wordB,
                                     "C": wordC,
                                     "D": wordD,
                                     "rating": rating,
                                     "RT": RT});

            trial++;
            if (trial <= numAnalogies) {
                // If the next trial should be an attention check, change the page to such a
                // trial and register the slider
                if (trial % numQsBtwnChecks == 0) {
                    attnCheckTrial = true;
                    psiTurk.showPage("attn-check-trial.html");

                    // Register the slider and its event handler
                    ratingSlider = new Slider("#rating-bar");
                    ratingSlider.on("slideStop", sliderClickHandler);
                }
                nextTrial();
                
            } else {
                finish();
            }
        }
    }

    function finish() {
        psiTurk.showPage("saving-results.html");
        psiTurk.saveData();
        // Wait to close the window to make sure that the data has been sent
        setTimeout(function() { psiTurk.completeHIT(); }, 500);
    }

    function sliderClickHandler() {
        if (!sliderClicked) {
            sliderClicked = true;
            $(sliderHandle).css("visibility", "visible");
            $("#submit").removeClass("disabled");
            $("#submit").click(submit);
            $("#submit").removeAttr("title");
        }
    }

    psiTurk.recordTrialData({"condition": condition});
    
    // Load the trial.html snippet into the body of the page
    psiTurk.showPage('trial.html');


    // Register the slider and its event handler
    var ratingSlider = new Slider("#rating-bar");
    ratingSlider.on("slideStop", sliderClickHandler);

    // Show the first set of analogy questions
    nextTrial();
}


// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
        instructionPages, // a list of pages you want to display in sequence
        function() { currentview = new AnalogyTransitivityExp(); } // what you want to do when you are done with instructions
    );
});
