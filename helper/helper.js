


function Helper_ArrSortEleLength (arr)
{
	arr.sort((a,b) =>
	{
		aArr = a.split(' ')
		bArr = b.split(' ')
		return bArr.length - aArr.length
	})
	return arr;
}

function Helper_SoftStringData (arrStr)
{
	var arr = arrStr.split(',')
	arr.sort((a,b) =>
	{
		aArr = a.split(' ')
		bArr = b.split(' ')
		return bArr.length - aArr.length
	})
	return arr.toString();
}