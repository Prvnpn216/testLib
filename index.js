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
        //for (let i = 0; i < 58; i++) {
          //  featureDataA.writeDoubleLE(fv_dict[row.md5hash_x][i], i * 8);
            //featureDataP.writeDoubleLE(fv_dict[row.md5hash_y][i], i * 8);
        //}
	const string1 = "0.52621725,0.44745155,0.46535276,0.53166064,0.23230017,0.23368621,0.26681735,0.29866798,0.17756731,0.34586162,0.17790309,12.11111111,9.66666667,0.24067692,0.36325066,2420.00000000,5856400.00000000,0.00000000,20.50000000,1.00000000,1.16738377,1.00000000,0.00000000,0.00000000,20.50000000,4.90588235,0.42033190,0.13985597,1.08239376,1.24020330,3.00000000,0.40125000,1.00000000,0.31459267,0.01764706,1.00000000,0.00000000,0.00000000,1.02500000,0.67797176,0.00040567,0.00000000,0.01754344,0.09756098,0.00000000,0.47619048,0.71428571,0.00000000,0.04000000,0.00000000,0.00000000,0.00000000,0.00000000,0.00000000,0.00000000,1.02500000,0.00000000,0.01070759";
	    const string2 = "0.27400594,0.42080065,0.49451620,0.50802727,0.25314577,0.25953811,0.26818539,0.39254078,0.18441304,0.30198778,0.12105840,23.22222222,25.66666667,0.18355440,0.25111412,1107.00000000,1225449.00000000,1.66666667,27.00000000,0.81481481,0.35545333,0.22473868,0.00000000,1.00000000,22.00000000,4.39950980,0.15294118,0.22311961,2.16578185,0.15418017,1.00000000,0.01478024,1.00000000,0.25989877,0.33148148,1.00000000,-1.00000000,3.00000000,0.81481481,0.47747004,0.00517330,5.60000000,0.28369776,0.27272727,-12.52880772,0.44897959,0.28000000,0.07527600,0.18830409,0.00000000,0.00000000,0.00000000,0.00000000,0.00000000,0.00000000,1.00000000,0.00000000,0.04814155";
const array1 = string1.split(',');
	    const array2 = string2.split(',');
	
	    for(let i = 0;i < 58; i++){
		featureDataA.writeDoubleLE(array1[i]);
		featureDataP.writeDoubleLE(array2[i]);	
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
