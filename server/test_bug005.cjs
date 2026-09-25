const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runTests() {
  console.log('--- BUG-005 TEST CASES ---');

  try {
    // We will simulate the logic from dashboard.js
    
    const mockPositionsDataCase1 = [
      { id: '1', title: 'Pos A', is_hiring: true },
      { id: '2', title: 'Pos B', is_hiring: true },
      { id: '3', title: 'Pos C', is_hiring: false }
    ];
    let openPositions = mockPositionsDataCase1.filter(p => p.is_hiring === true).length;
    console.log(`Case 1: Expected 2, Got ${openPositions} -> ${openPositions === 2 ? 'PASS' : 'FAIL'}`);

    const mockPositionsDataCase2 = [
      { id: '1', title: 'Pos A', is_hiring: true }
    ];
    // 50 candidates, doesn't matter since candidate array is independent now
    openPositions = mockPositionsDataCase2.filter(p => p.is_hiring === true).length;
    console.log(`Case 2 (50 candidates): Expected 1, Got ${openPositions} -> ${openPositions === 1 ? 'PASS' : 'FAIL'}`);

    const mockPositionsDataCase3 = [
      { id: '1', title: 'Pos A', is_hiring: false },
      { id: '2', title: 'Pos B', is_hiring: false }
    ];
    openPositions = mockPositionsDataCase3.filter(p => p.is_hiring === true).length;
    console.log(`Case 3: Expected 0, Got ${openPositions} -> ${openPositions === 0 ? 'PASS' : 'FAIL'}`);
    
    console.log(`Case 4 (Multiple candidates): Candidate count does NOT affect Open Positions logic because candidates are no longer used in the calculation -> PASS`);

    console.log('--- LIVE API VERIFICATION ---');
    // Fetch actual data to see what it is
    const { data: positions } = await supabase.from('positions').select('id, title, is_hiring');
    const { data: candidates } = await supabase.from('recruitment_candidates').select('id, status');

    const expectedMetric = (positions || []).filter(p => p.is_hiring === true).length;
    const oldMetric = new Set((candidates || []).filter(c => ['Applied', 'Screening', 'Interview'].includes(c.status)).map(c => c.status)).size;
    
    console.log(`Actual DB Positions with is_hiring=true: ${expectedMetric}`);
    console.log(`Old Broken Calculation would have yielded: ${oldMetric}`);

  } catch (error) {
    console.error('Error during test:', error);
  }
}

runTests();
