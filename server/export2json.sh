mongoexport --host localhost --db data-server --collection $1 -f test_id,step_idx,step_count,pbp,pres_mode,rep,reps,solved,steps,perception_count,retrieval_count,sol,timestamp --csv