
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
  


button.appendTo(document.body);
quietButton.appendTo(document.body);
largeButton.appendTo(document.body);
largeQuietButton.appendTo(document.body);
callToActionButton.appendTo(document.body);
largeCallToActionButton.appendTo(document.body);

iconButton.appendTo(document.body);
quietIconButton.appendTo(document.body);
largeIconButton.appendTo(document.body);
largeQuietIconButton.appendTo(document.body);

list.appendTo(document.body);
nav.prependTo(document.body);

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

var navInput = nav.add(input, {
	align: 'left',
	size: 'quarter'
});

input.placeholder("type something");