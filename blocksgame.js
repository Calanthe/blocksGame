var gCanvasElement;
var gDrawingContext;

var Cell = {
	row : -1,
	column : -1,
	image : 0,
	init : function (row,column,image){
	  return{
		row : row,
		column : column,
		image : image
       };
	}
}

var blocksGame = {

	kBoardWidth : 6,
	kBoardHeight : 4,
	kPieceWidth : 200,
	kPieceHeight : 200,
	gMoveCountElem : 0,

	IndexArray : [],
	
	gPieces : [],
	x1 : -1,
	y1 : -1,
	x2 : -1,
	y2 : -1,

	sprites : 0,
	inter : -1,
	
	getCursorPosition : function(el) { //taken from http://diveintohtml5.org/examples/canvas-halma.html
		
		var self = blocksGame;
		var x;
		var y;
		if (el.pageX != undefined && el.pageY != undefined) {
			x = el.pageX;
			y = el.pageY;
		}
		else {
			x = el.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = el.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		x -= gCanvasElement.offsetLeft;
		y -= gCanvasElement.offsetTop;
		x = Math.min(x, self.kBoardWidth * self.kPieceWidth);
		y = Math.min(y, self.kBoardHeight * self.kPieceHeight);
		var cell = Cell.init(Math.floor(y/self.kPieceHeight), Math.floor(x/self.kPieceWidth));
		return cell;
	},
	
	blocksOnClick : function(e) {

	var self = blocksGame;
	if (self.inter!=-1) return; //do nothing during animation
	
    var cell = self.getCursorPosition(e);

		for (var i = 0; i < self.kBoardDimension; i++) {
			if ((self.gPieces[i].row == cell.row) && (self.gPieces[i].column == cell.column)) 
			{
				if (self.gPieces[i].row-1>=0) 
					{
						if (self.gPieces[self.checkPieceId(self.gPieces[i].row-1,self.gPieces[i].column)].image==0) //if upper block has empty image
						{
							self.showAnimation(i,self.checkPieceId(self.gPieces[i].row-1,self.gPieces[i].column));
						}
					}
				if (self.gPieces[i].row+1<self.kBoardHeight) 
					{
						if (self.gPieces[self.checkPieceId(self.gPieces[i].row+1,self.gPieces[i].column)].image==0) //if lower block has empty image
						{
							self.showAnimation(i,self.checkPieceId(self.gPieces[i].row+1,self.gPieces[i].column));
						}
					}
				if (self.gPieces[i].column-1>=0)
					{
						if (self.gPieces[self.checkPieceId(self.gPieces[i].row,self.gPieces[i].column-1)].image==0) //if left block has empty image
						{
							self.showAnimation(i,self.checkPieceId(self.gPieces[i].row,self.gPieces[i].column-1));
						}
					}
				if (self.gPieces[i].column+1<self.kBoardWidth)
					{			
						if (self.gPieces[self.checkPieceId(self.gPieces[i].row,self.gPieces[i].column+1)].image==0) //if right block has empty image
						{
							self.showAnimation(i,self.checkPieceId(self.gPieces[i].row,self.gPieces[i].column+1));
						}
					}					
				return;
			}
		}
		return;
	},
	
	checkPieceId : function(row,column) { //check piece id with given row and column

		for (var i = 0; i < this.kBoardDimension; i++) {
			if (this.gPieces[i].row == row && this.gPieces[i].column == column) 
			{
				return i;
			}
		}	
		return;
	},
	
	checkPieceRowColumn : function(image,mode) { //check piece row px and column px with given image

		var result;
		if (!image) return;
		if (mode == 1) //return x px value
		{
			if (image%this.kBoardWidth == 0) result = this.kBoardWidth-1;
			else result = (image%this.kBoardWidth)-1;	
			result = result * this.kPieceWidth;
		}
		else //return y px value
		{
			result = Math.ceil(image/this.kBoardWidth)-1;
			result = result * this.kPieceHeight; 
		}
		return result; 
	},
	
	drawBoard : function(){
		
		var self = this;
		//start the game, draw whole board
		
		gDrawingContext.clearRect(0, 0, this.kPixelWidth, this.kPixelHeight);
		gDrawingContext.beginPath();
		
		this.sprites = new Image();
		this.sprites.src = 'image.jpg';
		
		this.sprites.onload = function() {
			for (var i = 0; i < self.kBoardDimension; i++) {
				self.drawPiece(self.gPieces[i]);	
			}
		};	
	},
	
	animate : function(Id1,Id2) {

		if (this.x1!=this.x2 || this.y1!=this.y2) 
		{
			gDrawingContext.clearRect(this.x1, this.y1, this.kPieceWidth, this.kPieceHeight);
			gDrawingContext.beginPath();
		
			if (this.x1>this.x2){  //move left or right, so only the x value changes
				this.x1 -= 10;
			} 
			else if (this.x1<this.x2){
				this.x1 += 10;
			}
			else if (this.y1>this.y2){ //move up or down, so only the y value changes
				this.y1 -= 10;
			} 
			else if (this.y1<this.y2){
				this.y1 += 10;
			}
			
			gDrawingContext.drawImage(this.sprites, this.checkPieceRowColumn(this.gPieces[Id1].image,1), this.checkPieceRowColumn(this.gPieces[Id1].image,0), this.kPieceWidth, this.kPieceHeight, this.x1, this.y1, this.kPieceWidth, this.kPieceHeight);
		} 
		else 
		{
			clearInterval(this.inter);
			this.inter = -1;
			var tmpImage = this.gPieces[Id2].image;
			this.gPieces[Id2].image = this.gPieces[Id1].image;
			this.gPieces[Id1].image = tmpImage;
		};
	},
	
	showAnimation : function(Id1, Id2){
		var column1 = this.gPieces[Id1].column;
		var row1 = this.gPieces[Id1].row;
		this.x1 = (column1 * this.kPieceWidth);
		this.y1 = (row1 * this.kPieceHeight);
			
		var column2 = this.gPieces[Id2].column;
		var row2 = this.gPieces[Id2].row;
		this.x2 = (column2 * this.kPieceWidth);
		this.y2 = (row2 * this.kPieceHeight);
		
		var self = this;
		
		this.inter = setInterval( function() { self.animate(Id1,Id2); }, 10);
		this.gMoveCountElem.innerHTML++;
	},
	
	drawPiece : function(p){

		var column = p.column;
		var row = p.row;
		var x_px = (column * this.kPieceWidth);
		var y_px = (row * this.kPieceHeight);
		gDrawingContext.drawImage(this.sprites, this.checkPieceRowColumn(p.image,1), this.checkPieceRowColumn(p.image,0), this.kPieceWidth, this.kPieceHeight, x_px, y_px, this.kPieceWidth, this.kPieceHeight);
	},
	
	newGame : function(){

		this.prepareIndexArray();
		
		var ip = 0;
		for (var i = 0; i < this.kBoardHeight; i++) {
			for (var j = 0; j < this.kBoardWidth; j++) {
				this.gPieces[ip] = Cell.init(i, j, this.IndexArray[ip]);
				ip++;
				}
		}
		this.drawBoard();
	},
	
	prepareIndexArray : function(){
	
		var im = 0;
		for (var j = 0; j < 24; j++) {
			this.IndexArray[im] = j;
			im++;
		}
		this.shuffle(this.IndexArray);
	},
	
	shuffle : function(o){ //function taken from http://snippets.dzone.com/posts/show/849
	
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	},

	initGame : function(canvasElement, moveCountElement) {

		this.kPixelWidth = this.kBoardWidth * this.kPieceWidth;
		this.kPixelHeight = this.kBoardHeight * this.kPieceHeight;
		this.kBoardDimension = this.kBoardHeight * this.kBoardWidth;

		gCanvasElement = canvasElement;
		gCanvasElement.width = this.kPixelWidth;
		gCanvasElement.height = this.kPixelHeight;
		this.gMoveCountElem = moveCountElement;
		gCanvasElement.addEventListener("click", this.blocksOnClick, false);
		gDrawingContext = gCanvasElement.getContext("2d");
		this.newGame();
	}
}