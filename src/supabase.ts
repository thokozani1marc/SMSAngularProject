import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucwaswrnsbewesdoworp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjd2Fzd3Juc2Jld2VzZG93b3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwNDcyNzEsImV4cCI6MjAzOTYyMzI3MX0.Cmb054loK-godKiy7b_mt6A_AcFPUpxzYW_zBNgzo3s';

export const supabase = createClient(supabaseUrl, supabaseKey);