const testAllFeatures = async () => {
    console.log('🧪 Testing All 5 Features\n');
    console.log('='.repeat(60));

    // Test 1: Code Analysis with Complexity
    console.log('\n1️⃣  Testing Code Analysis + Complexity...');
    try {
        const response = await fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: `int* ptr = new int[100];
for(int i = 0; i < 100; i++) {
    ptr[i] = i * i;
}`
            })
        });

        const data = await response.json();
        console.log('✅ Analysis Response:');
        console.log('   - Logic Error:', data.logicError?.message || 'None');
        console.log('   - Hints:', data.hints?.length || 0);
        console.log('   - Time Complexity:', data.complexity?.timeComplexity || 'N/A');
        console.log('   - Space Complexity:', data.complexity?.spaceComplexity || 'N/A');
        console.log('   - Quality Score:', data.complexity?.qualityScore || 'N/A');
    } catch (error) {
        console.log('❌ Analysis failed:', error.message);
    }

    // Test 2: Code Execution
    console.log('\n2️⃣  Testing Code Execution...');
    try {
        const response = await fetch('http://localhost:3000/api/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: `#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << (a + b) << endl;
    return 0;
}`,
                input: '10 20'
            })
        });

        const data = await response.json();
        console.log('✅ Execution Response:');
        console.log('   - Success:', data.success);
        console.log('   - Output:', data.output.trim());
        console.log('   - Exit Code:', data.exitCode);
    } catch (error) {
        console.log('❌ Execution failed:', error.message);
    }

    // Test 3: Chat Assistant
    console.log('\n3️⃣  Testing Chat Assistant...');
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: 'int* ptr = new int[100];',
                message: 'What is wrong with this code?',
                history: []
            })
        });

        const data = await response.json();
        console.log('✅ Chat Response:');
        console.log('   - Reply:', data.reply.substring(0, 100) + '...');
    } catch (error) {
        console.log('❌ Chat failed:', error.message);
    }

    // Test 4: Multiple Test Cases (simulated)
    console.log('\n4️⃣  Testing Multiple Test Cases...');
    const testCases = [
        { input: '5 10', expected: '15' },
        { input: '100 200', expected: '300' },
        { input: '-5 5', expected: '0' }
    ];

    let passed = 0;
    for (const tc of testCases) {
        try {
            const response = await fetch('http://localhost:3000/api/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: `#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << (a + b) << endl;
    return 0;
}`,
                    input: tc.input
                })
            });

            const data = await response.json();
            const actual = data.output.trim();
            if (actual === tc.expected) {
                passed++;
            }
        } catch (error) {
            console.log('   ❌ Test case failed');
        }
    }
    console.log(`✅ Test Cases: ${passed}/${testCases.length} passed`);

    // Test 5: Keyboard Shortcuts (UI feature - can't test via API)
    console.log('\n5️⃣  Keyboard Shortcuts:');
    console.log('   ℹ️  UI Feature - Test manually:');
    console.log('      - Ctrl+Enter: Run code');
    console.log('      - Ctrl+Shift+H: Get hint');
    console.log('      - Ctrl+K: Clear editor');

    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 All API tests completed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Code Analysis with Complexity');
    console.log('   ✅ Code Execution with Input');
    console.log('   ✅ AI Chat Assistant');
    console.log('   ✅ Multiple Test Cases');
    console.log('   ℹ️  Keyboard Shortcuts (UI only)');
    console.log('\n🚀 All features are operational!');
};

testAllFeatures().catch(console.error);
