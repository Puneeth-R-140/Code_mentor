const testAnalyze = async () => {
    console.log('Testing /api/analyze endpoint...\n');

    const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            code: 'int* ptr = new int[100];'
        })
    });

    const data = await response.json();
    console.log('✅ Analyze API Response:');
    console.log(JSON.stringify(data, null, 2));
};

const testExecute = async () => {
    console.log('\n\nTesting /api/execute endpoint...\n');

    const response = await fetch('http://localhost:3000/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            code: `#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << "Sum: " << (a + b) << endl;
    return 0;
}`,
            input: '5 10'
        })
    });

    const data = await response.json();
    console.log('✅ Execute API Response:');
    console.log(JSON.stringify(data, null, 2));
};

(async () => {
    try {
        await testAnalyze();
        await testExecute();
        console.log('\n\n🎉 All tests passed!');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
})();
