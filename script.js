function generateSubjects() {
            const numSubjects = parseInt(document.getElementById('num-subjects').value);
            const container = document.getElementById('subjects-container');
            
            if (isNaN(numSubjects) || numSubjects < 1) {
                container.innerHTML = '';
                return;
            }
            
            let html = '';
            for (let i = 1; i <= numSubjects; i++) {
                html += `
                    <div class="subject-card" style="animation-delay: ${i * 0.1}s">
                        <h4>Subject ${i}</h4>
                        <div class="subject-inputs">
                            <div class="input-group">
                                <label for="sub${i}-grade">Expected Grade Points</label>
                                <input type="number" id="sub${i}-grade" placeholder="e.g., 8.5" step="0.1" min="0" max="10">
                            </div>
                            <div class="input-group">
                                <label for="sub${i}-credit">Credit</label>
                                <input type="number" id="sub${i}-credit" placeholder="e.g., 4" step="1" min="1">
                            </div>
                        </div>
                    </div>
                `;
            }
            
            container.innerHTML = html;
        }

        function calculateSGPA() {
            const currentSGPA = parseFloat(document.getElementById('current-sgpa').value);
            const totalCredits = parseFloat(document.getElementById('total-credits').value);
            const numSubjects = parseInt(document.getElementById('num-subjects').value);
            const resultDiv = document.getElementById('result');

            // Basic validation
            if (isNaN(currentSGPA) || isNaN(totalCredits) || isNaN(numSubjects)) {
                resultDiv.innerHTML = '<div class="error">Please fill in all basic fields (Current SGPA, Total Credits, and Number of Subjects).</div>';
                resultDiv.classList.add('show');
                return;
            }

            if (totalCredits <= 0) {
                resultDiv.innerHTML = '<div class="error">Total credits must be greater than 0.</div>';
                resultDiv.classList.add('show');
                return;
            }

            // Collect subject data
            let subjects = [];
            let totalPoints = 0;
            let missingFields = false;

            for (let i = 1; i <= numSubjects; i++) {
                const grade = parseFloat(document.getElementById(`sub${i}-grade`).value);
                const credit = parseFloat(document.getElementById(`sub${i}-credit`).value);
                
                if (isNaN(grade) || isNaN(credit)) {
                    missingFields = true;
                    break;
                }
                
                const points = grade * credit;
                subjects.push({ grade, credit, points });
                totalPoints += points;
            }

            if (missingFields) {
                resultDiv.innerHTML = '<div class="error">Please fill in all subject fields with valid numbers.</div>';
                resultDiv.classList.add('show');
                return;
            }

            // Calculate increase in SGPA
            const increaseInSGPA = totalPoints / totalCredits;
            
            // Calculate new SGPA
            const newSGPA = currentSGPA + increaseInSGPA;

            // Create breakdown
            let breakdownHTML = `
                <strong>Calculation Breakdown:</strong><br>
                Current SGPA: ${currentSGPA.toFixed(2)}<br>
                Increase in SGPA: +${increaseInSGPA.toFixed(3)}<br>
                <hr style="margin: 10px 0; border: 1px solid rgba(255,255,255,0.3);">
            `;

            subjects.forEach((subject, index) => {
                breakdownHTML += `Subject ${index + 1}: ${subject.grade} × ${subject.credit} = ${subject.points.toFixed(1)} points<br>`;
            });

            breakdownHTML += `
                <hr style="margin: 10px 0; border: 1px solid rgba(255,255,255,0.3);">
                Total Points: ${totalPoints.toFixed(1)}<br>
                Total Credits: ${totalCredits}<br>
                Increase: ${totalPoints.toFixed(1)} ÷ ${totalCredits} = ${increaseInSGPA.toFixed(3)}
            `;

            // Display result
            resultDiv.innerHTML = `
                <h3>🎉 Calculation Results</h3>
                <div class="result-value">New SGPA: ${newSGPA.toFixed(2)}</div>
                <div class="result-breakdown">
                    ${breakdownHTML}
                </div>
            `;
            
            resultDiv.classList.add('show');
        }

        // Add some interactivity
        document.addEventListener('DOMContentLoaded', function() {
            document.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calculateSGPA();
                }
            });
        });