# Creates stimuli for each group of subjects that satisfy the following constraints:
# (1) Each subject sees exactly one comparison from each triad, no more, no less.
# (2) Each subject sees the same number of each type of comparison (1-2, 2-3, 1-3).
# (3) Across the groups, each comparison appears the same overall number of times.
# (4) A comparison does not always appear with the same other comparisons (though this will happen a bit).

import random
import numpy as np

stimuli = [[['hat', 'head'], ['mask', 'face'], ['disguise', 'identity']],
           [['foot', 'shoe'], ['wrist', 'bracelet'], ['wall', 'painting']],
           [['dog', 'mailman'], ['cat', 'mouse'], ['horse', 'hay']],
           [['nurse', 'patient'], ['mother', 'baby'], ['frog', 'tadpole']],
           [['cocoon', 'butterfly'], ['egg', 'chicken'], ['wine', 'vineyard']],
           [['person', 'clothes'], ['bird', 'feathers'], ['cat', 'whiskers']],
           [['student', 'backpack'], ['snail', 'shell'], ['rabbit', 'burrow']],
           [['wedding', 'bride'], ['aquarium', 'fish'], ['carton', 'milk']],
           [['flock', 'bird'], ['hive', 'bee'], ['hangar', 'airplane']],
           [['lawyer', 'books'], ['chemist', 'beakers'], ['librarian', 'books']],
           [['veil', 'face'], ['password', 'access'], ['key', 'safe']],
           [['pride', 'lion'], ['brain', 'neuron'], ['computer', 'chip']]]

num_reps = 4   # number of repetitions of each analogy
num_items = len(stimuli)
num_types = len(stimuli[0])
num_each_type = num_items / num_types
num_groups = num_types * num_reps

stimuli = np.array(stimuli)

comp_types = np.array([[0, 1, 2], [1, 2, 0], [2, 0, 1]])
comp_types = np.repeat(comp_types, num_each_type, axis = 1)

groups_stimuli = [[] for group in xrange(num_groups)]

group = 0
for repi in xrange(num_reps):
    print 'Round', repi
    rand_order = range(num_items)
    random.shuffle(rand_order)
    shuffled_stimuli = stimuli[rand_order].tolist()
    print shuffled_stimuli
    
    for t in xrange(num_types):
        for item in xrange(num_items):
            triad = shuffled_stimuli[item]
            
            comp_type = comp_types[t, item]
            if comp_type == 0:
                comp = [triad[0], triad[1]]
            elif comp_type == 1:
                comp = [triad[1], triad[2]]
            else:
                comp = [triad[0], triad[2]]
            
            groups_stimuli[group].append(comp)
        group += 1
    print

# Save the stimuli to a file
with open('static/js/stimuli.js', 'a') as out_file:
    out_file.write('var realQs = [\n')
    for group in xrange(num_groups):
        out_file.write('    [\n')
        analogies = groups_stimuli[group]
        for analogy in analogies:
            out_file.write('        ' + str(analogy) + ',\n')
        out_file.write('    ],\n')
    out_file.write('];\n')