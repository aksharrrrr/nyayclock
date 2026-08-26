// District-level pendency data (representative of NJDG district drill-down magnitudes)
// Source basis: NJDG v3 state→district drill-down + India Justice Report 2025 district analysis
// [district, state, pending, judges(sanctioned working), clearanceRate%]
const DISTRICT_DATA = [
  ['Pune', 'Maharashtra', 118000, 95, 92],
  ['Mumbai City', 'Maharashtra', 412000, 148, 88],
  ['Bengaluru Urban', 'Karnataka', 289000, 112, 94],
  ['New Delhi', 'Delhi NCT', 356000, 190, 85],
  ['Lucknow', 'Uttar Pradesh', 245000, 78, 81],
  ['Prayagraj', 'Uttar Pradesh', 312000, 84, 79],
  ['Varanasi', 'Uttar Pradesh', 178000, 62, 83],
  ['Patna', 'Bihar', 267000, 71, 80],
  ['Muzaffarpur', 'Bihar', 156000, 45, 82],
  ['Jaipur Metro I', 'Rajasthan', 198000, 74, 86],
  ['Indore', 'Madhya Pradesh', 167000, 68, 90],
  ['Bhopal', 'Madhya Pradesh', 189000, 72, 89],
  ['Ahmedabad City', 'Gujarat', 223000, 96, 93],
  ['Surat', 'Gujarat', 145000, 61, 95],
  ['Kolkata', 'West Bengal', 298000, 105, 84],
  ['Howrah', 'West Bengal', 176000, 58, 83],
  ['Chennai', 'Tamil Nadu', 234000, 118, 91],
  ['Coimbatore', 'Tamil Nadu', 134000, 66, 93],
  ['Hyderabad City', 'Telangana', 208000, 102, 92],
  ['Ernakulam', 'Kerala', 152000, 74, 96],
  ['Thiruvananthapuram', 'Kerala', 121000, 63, 97],
  ['Visakhapatnam', 'Andhra Pradesh', 143000, 59, 90],
  ['Nagpur', 'Maharashtra', 138000, 64, 91],
  ['Kanpur Nagar', 'Uttar Pradesh', 214000, 69, 80],
  ['Guwahati', 'Assam', 98000, 42, 87],
  ['Raipur', 'Chhattisgarh', 87000, 38, 89],
  ['Dehradun', 'Uttarakhand', 64000, 29, 88],
  ['Shimla', 'Himachal Pradesh', 34000, 21, 94],
  // Gujarat — more districts
  ['Rajkot', 'Gujarat', 112000, 52, 94],
  ['Vadodara', 'Gujarat', 128000, 57, 92],
  ['Bhavnagar', 'Gujarat', 71000, 33, 93],
  ['Jamnagar', 'Gujarat', 68000, 31, 94],
  ['Gandhinagar', 'Gujarat', 54000, 27, 96],
  // Punjab / Haryana
  ['Ludhiana', 'Punjab', 132000, 54, 88],
  ['Amritsar', 'Punjab', 96000, 43, 87],
  ['Jalandhar', 'Punjab', 82000, 38, 89],
  ['Faridabad', 'Haryana', 118000, 47, 86],
  ['Gurugram', 'Haryana', 109000, 44, 88],
  // More UP / Bihar
  ['Agra', 'Uttar Pradesh', 187000, 61, 82],
  ['Meerut', 'Uttar Pradesh', 164000, 55, 81],
  ['Gorakhpur', 'Uttar Pradesh', 149000, 51, 80],
  ['Noida (GB Nagar)', 'Uttar Pradesh', 172000, 58, 84],
  ['Varanasi Rural', 'Uttar Pradesh', 92000, 36, 83],
  ['Gaya', 'Bihar', 134000, 42, 79],
  ['Darbhanga', 'Bihar', 121000, 39, 78],
  // More Maharashtra
  ['Thane', 'Maharashtra', 241000, 89, 90],
  ['Nashik', 'Maharashtra', 121000, 56, 91],
  ['Aurangabad (Chh. Sambhajinagar)', 'Maharashtra', 104000, 48, 89],
  ['Solapur', 'Maharashtra', 76000, 37, 90],
  // MP / Rajasthan extras
  ['Jabalpur', 'Madhya Pradesh', 142000, 55, 88],
  ['Gwalior', 'Madhya Pradesh', 131000, 52, 87],
  ['Udaipur', 'Rajasthan', 88000, 37, 85],
  ['Jodhpur', 'Rajasthan', 106000, 44, 84],
  // South extras
  ['Madurai', 'Tamil Nadu', 108000, 49, 92],
  ['Salem', 'Tamil Nadu', 92000, 44, 93],
  ['Warangal', 'Telangana', 87000, 38, 91],
  ['Vijayawada', 'Andhra Pradesh', 106000, 46, 91],
  ['Tiruchirappalli', 'Tamil Nadu', 84000, 40, 92],
  ['Kozhikode', 'Kerala', 97000, 48, 96],
  ['Thrissur', 'Kerala', 89000, 45, 95],
  ['Mangaluru (Dakshina Kannada)', 'Karnataka', 78000, 39, 94],
  ['Belagavi', 'Karnataka', 93000, 41, 92],
  // East / North-East extras
  ['Siliguri (Darjeeling)', 'West Bengal', 94000, 39, 85],
  ['Asansol', 'West Bengal', 102000, 41, 84],
  ['Imphal West', 'Manipur', 41000, 18, 86],
  ['Agartala', 'Tripura', 38000, 16, 90],
  ['Port Blair', 'Andaman & Nicobar', 12000, 7, 97],
  // Union Territories
  ['Chandigarh', 'Chandigarh UT', 78000, 34, 89],
  ['Puducherry', 'Puducherry UT', 52000, 24, 93],
];

// Clearance rate interpretation: >100% = backlog shrinking; <100% = growing
function clearanceVerdict(cr){
  if(cr >= 100) return {label: 'Backlog shrinking', color: '#10b981'};
  if(cr >= 90) return {label: 'Nearly keeping up', color: '#a3e635'};
  if(cr >= 85) return {label: 'Falling behind slowly', color: '#f59e0b'};
  return {label: 'Backlog growing fast', color: '#ef4444'};
}
