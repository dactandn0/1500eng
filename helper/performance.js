

var DOM_LOAD_IDX = [];

function PushLoadedIdx (idx) {
	if (!IsLoadedIdx(idx))
		DOM_LOAD_IDX.push(idx);
}

function IsLoadedIdx (idx) {
	return DOM_LOAD_IDX.includes(idx);
}

