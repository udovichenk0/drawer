export const normilizeCoord = (crd: number) => {
  //0 and 500 is the min and the max value of canvas coords
  //make the value not hardcoded
  if(crd >= 0 && crd <= 500) return crd
  else if(crd > 500) return 500 
  return 0
}  