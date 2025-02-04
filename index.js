const ffi = require('ffi-napi');
const ref = require('ref-napi');
 
// Load the shared library (.so file on Linux)
const distanceCalculator = ffi.Library('./external-libs/libMainFVCalc.so', {
    'link_library': ['int', ['string', 'string', 'string']],
    'get_distance': ['int', ['pointer', 'pointer', 'pointer']]
});
 
// Define file paths
const filePdOne = "./setupFiles/SetupPDOne.txt";
const fileStdDev = "./setupFiles/StdDev_MedValData.txt";
const fileTestCases = "./setupFiles/TestCases.txt";
 
// Call link_library function
const result = distanceCalculator.link_library(filePdOne, fileStdDev, fileTestCases);
 
if (result === 0) {
    console.log("link_library succeeded");
} else {
    console.log("link_library failed");
}
 
// Sample feature vector dictionary (Replace with your actual data)
const fv_dict = {
    "hash1": new Array(61).fill(0.5), // Example feature vectors
    "hash2": new Array(61).fill(0.3)
};
 
// Function to calculate distance
function calculateDistance(row) {
    try {
        const featureDataA = Buffer.alloc(58 * 8); // 58 doubles (8 bytes each)
        const featureDataP = Buffer.alloc(58 * 8);
        const distance01 = Buffer.alloc(8); // Space for a double
 
        // Fill buffers with data
        for (let i = 0; i < 58; i++) {
            featureDataA.writeDoubleLE(fv_dict[row.md5hash_x][i], i * 8);
            featureDataP.writeDoubleLE(fv_dict[row.md5hash_y][i], i * 8);
        }
 
        // Call get_distance function
        distanceCalculator.get_distance(featureDataA, featureDataP, distance01);
 
        row.D01 = distance01.readDoubleLE(0);
    } catch (error) {
        console.error(error);
        row.D01 = 100000000;
    }
    return row;
}
 
// Example usage
const row = { md5hash_x: "hash1", md5hash_y: "hash2" };
const resultRow = calculateDistance(row);
console.log(resultRow);
