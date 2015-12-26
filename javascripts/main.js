function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

var query = getQueryParams(document.location.search);

var currLevel = 0;
var selectedTags = '';
if(query.l !== undefined){
	currLevel =  parseInt(query.l);
}
if(query.t !== undefined){
	selectedTags =  query.t;
}

var getTagsByLevel = function(l){
	return JSLINQ(tags).Where(function(item) { 
		return item.level == l; 
	});
}

var getGiftsByTags = function(selectedTags){
	return JSLINQ(gifts).Where(function(item) { 
		return item.tags == selectedTags;
	});
}


var bindGifts = function() {
	var result = getGiftsByTags(selectedTags);
	var categoryTitle = document.getElementById("categoryTitle");
	categoryTitle.innerHTML = "You can gift:";
	var options = document.getElementById("options");
    for (var i = 0; i < result.items.length; i++) {
        var sampleElement = document.createElement("li");
        var gift = result.items[i];
        sampleElement.innerHTML = "<label>"+ gift.name + "</label>";
        options.appendChild(sampleElement);
    }
}

var bindTags = function() {
    
    var result = getTagsByLevel(currLevel);
    var currCategory = result.items[0];
    
    //We reached the end
    if(currCategory === undefined){
    	bindGifts();
    	return;
    }

    var currTags = currCategory.options;
    var catName = currCategory.description;

	var categoryTitle = document.getElementById("categoryTitle");
	categoryTitle.innerHTML = catName;
    var options = document.getElementById("options");

    for (var i = 0; i < currTags.length; i++) {
        var sampleElement = document.createElement("li");
        var tag = currTags[i];
        var icon = "<icon class='fa fa-" + tag.icon + "'></icon>";
        var nextTags =  selectedTags + tag.id + ",";
        sampleElement.innerHTML = "<a href='index.html?l=" + (currLevel + 1) + "&t=" + nextTags + "' >" + icon + "<label>"+ tag.name + "</label></a>";
        options.appendChild(sampleElement);
    }
};

