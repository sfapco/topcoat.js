
var button = topcoat.Button()
  , quietButton = topcoat.QuietButton()
  , largeButton = topcoat.LargeButton()
  , largeQuietButton = topcoat.LargeQuietButton()
  , callToActionButton = topcoat.CallToActionButton()
  , largeCallToActionButton = topcoat.LargeCallToActionButton()
  , iconButton = topcoat.IconButton()
  , quietIconButton = topcoat.QuietIconButton()
  , largeIconButton = topcoat.LargeIconButton()
  , largeQuietIconButton = topcoat.LargeQuietIconButton()
  , list = topcoat.List()
  , nav = topcoat.NavigationBar()
  , input = topcoat.Input()
  , largeInput = topcoat.LargeInput()
  , searchInput = topcoat.SearchInput()
  , largeSearchInput = topcoat.LargeSearchInput()
  , textArea = topcoat.TextArea()
  , largeTextArea = topcoat.LargeTextArea()

function br () {
	document.body.appendChild(document.createElement('br'));
} 

input.placeholder("input placeholder");
largeInput.placeholder("large input placeholder");
searchInput.placeholder("search input placeholder");
largeSearchInput.placeholder("large search input placeholder");
textArea.placeholder("text area placeholder");
largeTextArea.placeholder("large text area placeholder");

button.appendTo(document.body);
br();
quietButton.appendTo(document.body);
br();
largeButton.appendTo(document.body);
br();
largeQuietButton.appendTo(document.body);
br();
callToActionButton.appendTo(document.body);
br();
largeCallToActionButton.appendTo(document.body);
br();

iconButton.appendTo(document.body);
br();
quietIconButton.appendTo(document.body);
br();
largeIconButton.appendTo(document.body);
br();
largeQuietIconButton.appendTo(document.body);
br();
list.appendTo(document.body);
br();
nav.prependTo(document.body);
br();
input.appendTo(document.body);
br();
largeInput.appendTo(document.body);
br();
searchInput.appendTo(document.body);
br();
largeSearchInput.appendTo(document.body);
br();
textArea.appendTo(document.body);
br();
largeTextArea.appendTo(document.body);
br();


button.text('button');
quietButton.text('quiet button');
largeButton.text('large button');
largeQuietButton.text('large quiet button');
callToActionButton.text('CTA button');
largeCallToActionButton.text('large CTA button');

list.header.text('list header')
list.push("fooo");
list.push("biz");
list.push("baz");
list.pop();


var navItem = nav.add(iconButton, {
	size: 'quarter',
	align: 'left'
});


var navTitle = nav.title("Navigation title", {
	size: 'half',
	align: 'center'
});

