# Overview

This is the code for Experiment 3 (violations of the triangle inequality in relational similarity judgments, or in other words, violations of transitivity in analogy quality judgments) in "Evaluating vector-space models of analogy" (Chen, Peterson, & Griffiths, to appear in the *CogSci 2017 Proceedings*). You can download the paper [here](https://arxiv.org/abs/1705.04416). The code uses [psiTurk](https://psiturk.org/).


# Screenshots

Here is an example trial:

![Example analogy transitivity trial](https://github.com/sdawnchen/analogy-transitivity-exp/blob/master/screenshots/trial.png)

The `screenshots` folder also contains a screenshot of the instructions page.


# Stimuli Details

As described in the paper, we created stimuli for which people's analogy quality judgments were expected to violate the transitivity property. In other words, we created triads, *A*:*B*, *C*:*D*, and *E*:*F*, for which *A*:*B*::*C*:*D* holds and *C*:*D*::*E*:*F* holds, but *A*:*B*::*E*:*F* does not hold. We obtained ratings of analogy quality for all three analogies from each triad. We created twelve such triads, shown in `get_groups_stimuli.py`. This script creates 12 subsets of the analogy stimuli (each participant is randomly assigned to one of the subsets), subject to the following constraints:

1. Each subset contains exactly one analogy from each triad.
2. Each subsets contains the same number (4) of each type of analogy (*A*:*B*::*C*:*D*, *C*:*D*::*E*:*F*, or *A*:*B*::*E*:*F*).
3. Across the subsets, each of the 36 analogies appears the same overall number of times.
4. Each analogy does not always appear with the same other analogies.

The stimuli subsets are saved in the file `static/js/stimuli.js`.


# Dependencies/Credits

All dependencies have been included. These include [psiTurk](https://psiturk.org/), [jQuery](https://jquery.com/), [Underscore](http://underscorejs.org/), [Backbone](http://backbonejs.org/), [D3](https://d3js.org/), [Bootstrap](http://getbootstrap.com/), and [bootstrap-slider](http://seiyria.com/bootstrap-slider/).
