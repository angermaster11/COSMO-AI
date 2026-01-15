// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://twkrrutliaitwqkljqef.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3a3JydXRsaWFpdHdxa2xqcWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0OTgzMjYsImV4cCI6MjA4NDA3NDMyNn0.A-ITIRYxXWdowhJinLNd8uxy-g32LJonWX1PPFFFhpE';

export const supabase = createClient(supabaseUrl, supabaseKey);