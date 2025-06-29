let users = [];
let nextUserId = 1;

// Hash algorithms
const hashAlgorithms = {
    length: (input) => {
        return {
            hash: input.length.toString(),
            steps: [
                `Input: "${input}"`,
                `Count characters: ${input.length}`,
                `Hash result: ${input.length}`
            ]
        };
    },
    ascii: (input) => {
        let sum = 0;
        let steps = [`Input: "${input}"`];
        for (let i = 0; i < input.length; i++) {
            const ascii = input.charCodeAt(i);
            sum += ascii;
            steps.push(`Character '${input[i]}' = ASCII ${ascii}, running sum = ${sum}`);
        }
        steps.push(`Final hash: ${sum}`);
        return {
            hash: sum.toString(),
            steps: steps
        };
    },
    simple: (input) => {
        let hash = 0;
        let steps = [`Input: "${input}"`];
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash + char) & 0xffffffff;
            steps.push(`Process '${input[i]}' (${char}): hash = ${hash}`);
        }
        steps.push(`Final hash: ${Math.abs(hash)}`);
        return {
            hash: Math.abs(hash).toString(),
            steps: steps
        };
    },
    md5: (input) => {
        return {
            hash: CryptoJS.MD5(input).toString(),
            steps: [
                `Input: "${input}"`,
                `Apply MD5 algorithm (complex mathematical operations)`,
                `Result: 32-character hexadecimal hash`
            ]
        };
    }
};

const algorithmInfo = {
    length: {
        name: "Length Hash Algorithm",
        description: "Simply returns the length of the input string. Extremely vulnerable to collisions!",
        security: "NEVER use for security - trivial to create collisions"
    },
    ascii: {
        name: "ASCII Sum Hash Algorithm",
        description: "Sums up all ASCII values of characters. Still very vulnerable to collisions.",
        security: "NEVER use for security - easy to create collisions with anagrams"
    },
    simple: {
        name: "Simple Character Hash Algorithm",
        description: "Basic hash using bit shifting. Better than length/ASCII but still weak.",
        security: "NEVER use for security - vulnerable to various attacks"
    },
    md5: {
        name: "MD5 Hash Algorithm",
        description: "Cryptographic hash function, but now considered broken due to collision vulnerabilities.",
        security: "Deprecated for security use - use SHA-256 or better in real applications"
    }
};

function showTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected section and activate tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function updateAlgorithmInfo() {
    const algorithm = document.getElementById('hashAlgorithm').value;
    const info = algorithmInfo[algorithm];
    const infoDiv = document.getElementById('algorithmInfo');
    
    infoDiv.innerHTML = `
        <h4>${info.name}</h4>
        <p>${info.description}</p>
        <p><strong>Security:</strong> ${info.security}</p>
    `;
}

function performHashAndDemo() {
    performHash();
    demonstrateChange();
}

function performHash() {
    const input = document.getElementById('hashInput').value;
    const algorithm = document.getElementById('hashAlgorithm').value;
    
    const result = hashAlgorithms[algorithm](input);
    
    document.getElementById('hashValue').textContent = result.hash;
    
    const stepsDiv = document.getElementById('hashSteps');
    const stepsContent = document.getElementById('stepsContent');
    
    stepsContent.innerHTML = result.steps.map(step => `<p>• ${step}</p>`).join('');
    stepsDiv.style.display = 'block';
}

function demonstrateChange() {
    const input = document.getElementById('hashInput').value;
    const algorithm = document.getElementById('hashAlgorithm').value;
    
    // Create a small change (add one character or change one character)
    const modified = input + 'X';
    
    const originalResult = hashAlgorithms[algorithm](input);
    const modifiedResult = hashAlgorithms[algorithm](modified);
    
    document.getElementById('original-input').textContent = input;
    document.getElementById('original-hash').textContent = originalResult.hash;
    document.getElementById('modified-input').textContent = modified;
    document.getElementById('modified-hash').textContent = modifiedResult.hash;
    
    document.getElementById('changeDemo').style.display = 'block';
}

function findCollisions() {
    const algorithm = document.getElementById('collisionAlgorithm').value;
    const resultsDiv = document.getElementById('collisionResults');
    
    let collisions = [];
    
    if (algorithm === 'length') {
        collisions = [
            ['Hi', 'By'],
            ['Cat', 'Dog'],
            ['Hello', 'World'],
            ['A', 'B']
        ];
    } else if (algorithm === 'ascii') {
        collisions = [
            ['AB', 'BA'],  // Both sum to same ASCII values
            ['CAB', 'ABC'],
            ['listen', 'silent'],
            ['A', '!']  // A=65, !=33, but we can find others
        ];
    } else if (algorithm === 'simple') {
        collisions = [
            ['A', '!'],
            ['test1', 'test2'],  // May or may not collide, but demonstrates concept
        ];
    }
    
    resultsDiv.innerHTML = '';
    collisions.forEach(pair => {
        const hash1 = hashAlgorithms[algorithm](pair[0]);
        const hash2 = hashAlgorithms[algorithm](pair[1]);
        
        if (hash1.hash === hash2.hash) {
            const div = document.createElement('div');
            div.className = 'collision-item error';
            div.innerHTML = `
                <h4>🚨 COLLISION FOUND!</h4>
                <p>"${pair[0]}" → Hash: ${hash1.hash}</p>
                <p>"${pair[1]}" → Hash: ${hash2.hash}</p>
                <p><strong>Different inputs, same hash!</strong></p>
            `;
            resultsDiv.appendChild(div);
        }
    });
    
    resultsDiv.style.display = 'grid';
}

function customCollisionTest() {
    document.getElementById('customCollisionTest').style.display = 'block';
}

function compareHashes() {
    const input1 = document.getElementById('collision1').value;
    const input2 = document.getElementById('collision2').value;
    const algorithm = document.getElementById('collisionAlgorithm').value;
    
    if (!input1 || !input2) {
        alert('Please enter both inputs!');
        return;
    }
    
    const hash1 = hashAlgorithms[algorithm](input1);
    const hash2 = hashAlgorithms[algorithm](input2);
    
    const resultDiv = document.getElementById('comparisonResult');
    
    if (hash1.hash === hash2.hash) {
        resultDiv.className = 'hash-result error';
        resultDiv.innerHTML = `
            <h4>🚨 COLLISION DETECTED!</h4>
            <p>"${input1}" → ${hash1.hash}</p>
            <p>"${input2}" → ${hash2.hash}</p>
            <p><strong>These different inputs produce the same hash!</strong></p>
        `;
    } else {
        resultDiv.className = 'hash-result success';
        resultDiv.innerHTML = `
            <h4>✅ No Collision</h4>
            <p>"${input1}" → ${hash1.hash}</p>
            <p>"${input2}" → ${hash2.hash}</p>
            <p><strong>Different hashes for different inputs (as expected)</strong></p>
        `;
    }
}

function createAccount() {
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const algorithm = document.getElementById('accountHashAlgorithm').value;
    
    if (!username || !password) {
        showAccountFeedback('Please enter both username and password!', 'error');
        return;
    }
    
    // Check if username already exists
    if (users.find(user => user.username === username)) {
        showAccountFeedback('Username already exists!', 'error');
        return;
    }
    
    const hashedPassword = hashAlgorithms[algorithm](password);
    
    const newUser = {
        id: nextUserId++,
        username: username,
        passwordHash: hashedPassword.hash,
        algorithm: algorithm
    };
    
    users.push(newUser);
    updateUserTable();
    
    showAccountFeedback(`Account created successfully! Password hashed using ${algorithmInfo[algorithm].name}`, 'success');
    
    // Clear form
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
}

function attemptLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showAccountFeedback('Please enter both username and password!', 'error');
        return;
    }
    
    const user = users.find(u => u.username === username);
    
    if (!user) {
        showAccountFeedback('Username not found!', 'error');
        showLoginProcess([
            `Looking for username: "${username}"`,
            `❌ Username not found in database`,
            `Login failed`
        ]);
        return;
    }
    
    const hashedInputPassword = hashAlgorithms[user.algorithm](password);
    
    const steps = [
        `Looking for username: "${username}"`,
        `✅ Username found in database`,
        `User's stored hash: ${user.passwordHash}`,
        `Hashing input password using ${algorithmInfo[user.algorithm].name}`,
        `Input password hash: ${hashedInputPassword.hash}`,
        `Comparing hashes...`
    ];
    
    if (hashedInputPassword.hash === user.passwordHash) {
        steps.push(`✅ Hashes match! Login successful`);
        showAccountFeedback('Login successful!', 'success');
    } else {
        steps.push(`❌ Hashes don't match! Login failed`);
        showAccountFeedback('Invalid password!', 'error');
    }
    
    showLoginProcess(steps);
}

function showAccountFeedback(message, type) {
    const feedback = document.getElementById('accountFeedback');
    feedback.className = `hash-result ${type}`;
    feedback.innerHTML = `<strong>${message}</strong>`;
    feedback.style.display = 'block';
}

function showLoginProcess(steps) {
    const processDiv = document.getElementById('loginProcess');
    const stepsDiv = document.getElementById('loginSteps');
    
    stepsDiv.innerHTML = steps.map(step => `<p>• ${step}</p>`).join('');
    processDiv.style.display = 'block';
}

function updateUserTable() {
    const tbody = document.getElementById('userTableBody');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #6c757d; font-style: italic;">No accounts created yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td class="mono">${user.passwordHash}</td>
            <td>${algorithmInfo[user.algorithm].name}</td>
        </tr>
    `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('hashAlgorithm').addEventListener('change', updateAlgorithmInfo);
    updateAlgorithmInfo();
    performHashAndDemo(); // Show initial example
});