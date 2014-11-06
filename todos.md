Question: We have three types of things: objects (O), selectors (S) and features (F). We spread activation from S ==> O and from S ==> F. Should we also spread activation for O <==> F and O,F ==> S? One reason to want F ==> S is that this way manually boosting the attention to a feature will also boost attention to that selector. It would also be good to keep the basic selectors like (square) more active later in the game.
Alternatively, we could build combined selectors based directly on the feature activation.

Todo: Look at how Act-R implements the "activation calculus" for declarative memory (can model short- and long-term memory). Act-R is best for modelling reaction times and timing-based behaviors, memory retrieval and can also simulate what brain reagions should light up in FMRI recodings.

Issue: Prior activation of a feature does not make a big difference... We might want to pay attention to feature activity when combining selectors.
==> Is this really true? How does it compare to directly giving some base-selectors (e.g. activating "supports" and "square" VS. introducing a highly active "supports (any object)" and "square objects" hypotheses)?

Issue: Currently, we are adding all solution hypothesis we come up with (bad or good), which are a lot! We need a mechanism to either forget some or only introduce a fraction of the ones we come up with. Probably both!
==> Is this really an issue? Our main behavior can now instead reduce the activation for combining hypotheses if we have too many.

Issue: Feature activation is dropping too fast -- if a problem is not solved quickly, the activations are all at bottom level. One reason is that we now heavily penalize complex solutions, so they contribute almost nothing to the feature activation.
==> Is this really true?

Question: We should probably somehow model that we switch scenes faster when we don't perceive a lot and there are no good hypotheses left to check.

Question: Should we use the feature attention somewhere else than in the attr-codelet?

Question: Should we strongly prefer single-object selectors when combining solutions? The simple problem PBP 16 (circle left of square) takes forever!
==> this should be okay since attributes are perceived and combined through objects now

Idea: Instead of just merging hypotheses, we could go more into the Genetic Algorithm direction and actually recombine them, or even try dropping parts of the selector, so we have a way to simplify things.

Won't do: The SolutionMergingCodelet can't modify the other_selector of a relationship anymore. One way to do it might be to swap the other_selector of a relationship instead of merging it.

Won't do: Allow perceiving a object attribute on an existing group! Make sure the combined selector is constructed in the next step.
==> What we wanted to achieve with this is now covered by the CombineHypothesisCodelet.

Won't do: Abstraction levels for functions.

Question: Actively simplify selectors? Or better: When combining hypotheses, only allow to add a single feature from the second hypothesis to the first. Pick a feature that is not contained in the fist hypothesis or course.
How big a problem is this really?