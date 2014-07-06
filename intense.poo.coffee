window.requestAnimFrame = (->
	window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or (callback) ->
		window.setTimeout callback, 1000 / 60
		return
)()
window.cancelRequestAnimFrame = (->
	window.cancelAnimationFrame or window.webkitCancelRequestAnimationFrame or window.mozCancelRequestAnimationFrame or window.oCancelRequestAnimationFrame or window.msCancelRequestAnimationFrame or clearTimeout
)()

# Applys a dict of css properties to an element
applyProperties = (target, properties) ->
	for key of properties
		target.style[key] = properties[key]
	return

class IntenseCustom
	KEYCODE_ESC: 27
	mouse:
		xCurr: 0
		yCurr: 0
		xDest: 0
		yDest: 0

	horizontalOrientation: true
	looper: undefined
	lastPosition: undefined
	currentPosition: 0
	sourceDimensions: undefined
	target: undefined
	targetDimensions:
		w: 0
		h: 0

	container: undefined
	containerDimensions:
		w: 0
		h: 0

	overflowArea:
		x: 0
		y: 0

	overflowValue: undefined
	constructor: (element, initOnClick = false) ->

		# Parse arguments
		throw "You need to pass an element!"  unless element
		if initOnClick
			@startTracking element
		return @


	# Returns whether target a vertical or horizontal fit in the page.
	# As well as the right fitting width/height of the image.
	getFit: (source) ->
		heightRatio = window.innerHeight / source.h
		if (source.w * heightRatio) > window.innerWidth
			w: source.w * heightRatio
			h: source.h * heightRatio
			fit: true
		else
			widthRatio = window.innerWidth / source.w
			w: source.w * widthRatio
			h: source.h * widthRatio
			fit: false
	
	# -------------------------
	#    /*          APP
	#    /* -------------------------
	startTracking: (passedElements) ->
		i = undefined
		
		# If passed an array of elements, assign tracking to all.
		if passedElements.length
			
			# Loop and assign
			i = 0
			while i < passedElements.length
				@track passedElements[i]
				i++
		else
			@track passedElements
		return
	track: (element) ->
		
		# Element needs a src at minumun.
		if element.getAttribute("data-image") or element.src
			element.addEventListener "click", (->
				@init this
				return
			), false
		return
	start: ->
		@_loop()
		return
	stop: ->
		cancelRequestAnimFrame @looper if @looper
		return
	_loop: ->
		@looper = requestAnimFrame(@_loop.bind(@))
		@positionTarget()
		return
	
	# Lock scroll on the document body.
	lockBody: ->
		@overflowValue = document.body.style.overflow
		document.body.style.overflow = "hidden"
		return
	
	# Unlock scroll on the document body.
	unlockBody: ->
		document.body.style.overflow = @overflowValue
		return
	createViewer: (title, caption) ->
		
		#
		#       *  Container
		#       
		containerProperties =
			backgroundColor: "rgba(0,0,0,0.8)"
			width: "100%"
			height: "100%"
			position: "fixed"
			top: "0px"
			left: "0px"
			overflow: "hidden"
			zIndex: "999999"
			margin: "0px"
			webkitTransition: "opacity 150ms cubic-bezier( 0, 0, .26, 1 )"
			MozTransition: "opacity 150ms cubic-bezier( 0, 0, .26, 1 )"
			transition: "opacity 150ms cubic-bezier( 0, 0, .26, 1 )"
			opacity: "0"

		@container = document.createElement("figure")
		@container.className = 'intense-figure'
		@container.appendChild @target
		applyProperties @container, containerProperties
		imageProperties = cursor: "url( \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3Q0IyNDI3M0FFMkYxMUUzOEQzQUQ5NTMxMDAwQjJGRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3Q0IyNDI3NEFFMkYxMUUzOEQzQUQ5NTMxMDAwQjJGRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdDQjI0MjcxQUUyRjExRTM4RDNBRDk1MzEwMDBCMkZEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdDQjI0MjcyQUUyRjExRTM4RDNBRDk1MzEwMDBCMkZEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+soZ1WgAABp5JREFUeNrcWn9M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\" ) 25 25, auto"
		applyProperties @target, imageProperties
		
		#
		#       *  Caption Container
		#       
		captionContainerProperties =
			fontFamily: "Georgia, Times, \"Times New Roman\", serif"
			position: "fixed"
			bottom: "0px"
			left: "0px"
			padding: "20px"
			color: "#fff"
			wordSpacing: "0.2px"
			webkitFontSmoothing: "antialiased"
			textShadow: "-1px 0px 1px rgba(0,0,0,0.4)"

		captionContainer = document.createElement("figcaption")
		applyProperties captionContainer, captionContainerProperties
		
		#
		#       *  Caption Title
		#       
		if title
			captionTitleProperties =
				margin: "0px"
				padding: "0px"
				fontWeight: "normal"
				fontSize: "40px"
				letterSpacing: "0.5px"
				lineHeight: "35px"
				textAlign: "left"

			captionTitle = document.createElement("h1")
			applyProperties captionTitle, captionTitleProperties
			captionTitle.innerHTML = title
			captionContainer.appendChild captionTitle
		if caption
			captionTextProperties =
				margin: "0px"
				padding: "0px"
				fontWeight: "normal"
				fontSize: "20px"
				letterSpacing: "0.1px"
				maxWidth: "500px"
				textAlign: "left"
				background: "none"
				marginTop: "5px"

			captionText = document.createElement("h2")
			applyProperties captionText, captionTextProperties
			captionText.innerHTML = caption
			captionContainer.appendChild captionText
		@container.appendChild captionContainer
		@setDimensions()
		@mouse.xCurr = @mouse.xDest = window.innerWidth / 2
		@mouse.yCurr = @mouse.yDest = window.innerHeight / 2
		document.body.appendChild @container
		setTimeout (->
			@container.style["opacity"] = "1"
			return
		).bind(@), 10
		return
	removeViewer: ->
		@unlockBody()
		@unbindEvents()
		try 
			document.body.removeChild @container
		
		catch err
			console.log err
		return
	setDimensions: ->
		
		# Manually set height to stop bug where 
		imageDimensions = @getFit(@sourceDimensions)
		@target.width = imageDimensions.w
		@target.height = imageDimensions.h
		@horizontalOrientation = imageDimensions.fit
		@targetDimensions =
			w: @target.width
			h: @target.height

		@containerDimensions =
			w: window.innerWidth
			h: window.innerHeight

		@overflowArea =
			x: @containerDimensions.w - @targetDimensions.w
			y: @containerDimensions.h - @targetDimensions.h

		return
	init: (element) ->
		imageSource = element.getAttribute("data-image") or element.src
		title = element.getAttribute("data-title")
		caption = element.getAttribute("data-caption")
		
		# Add loading css class for styling element while loading
		elemClasses = element.className.split(" ")
		elemClasses.push "intense-loading"
		element.className = elemClasses.join(" ")
		img = new Image()
		self = @
		img.onload = ->
			self.sourceDimensions = # Save original dimensions for later.
				w: img.width
				h: img.height

			self.target = this
			self.createViewer title, caption
			self.lockBody()
			self.bindEvents()
			self._loop()
			
			# remove loading css class
			element.className = element.className.replace("intense-loading", "")
			return

		img.src = imageSource
		return
	bindEvents: ->
		@container?.addEventListener? "mousemove", @onMouseMove.bind(@), false
		@container?.addEventListener? "touchmove", @onTouchMove.bind(@), false
		window.addEventListener "resize", @setDimensions.bind(@), false
		window.addEventListener "keyup", @onKeyUp.bind(@), false
		@target.addEventListener "click", @removeViewer.bind(@), false
		return
	unbindEvents: ->
		@container?.removeEventListener? "mousemove", @onMouseMove.bind(@), false
		@container?.removeEventListener? "touchmove", @onTouchMove.bind(@), false
		window.removeEventListener "resize", @setDimensions.bind(@), false
		window.removeEventListener "keyup", @onKeyUp.bind(@), false
		@target.removeEventListener "click", @removeViewer.bind(@), false
		return
	onMouseMove: (event) ->
		@mouse.xDest = event.clientX
		@mouse.yDest = event.clientY
		return
	onTouchMove: (event) ->
		@mouse.xDest = event.touches[0].clientX
		@mouse.yDest = event.touches[0].clientY
		return
	
	# Exit on excape key pressed;
	onKeyUp: (event) ->
		event.preventDefault()
		@removeViewer()  if event.keyCode is @KEYCODE_ESC
		return
	positionTarget: ->
		@mouse.xCurr += (@mouse.xDest - @mouse.xCurr) * 0.05
		@mouse.yCurr += (@mouse.yDest - @mouse.yCurr) * 0.05
		if @horizontalOrientation is true
			
			# HORIZONTAL SCANNING
			@currentPosition += (@mouse.xCurr - @currentPosition)
			if @mouse.xCurr isnt @lastPosition
				position = parseFloat(@currentPosition / @containerDimensions.w)
				position = @overflowArea.x * position
				@target.style["webkitTransform"] = "translate3d(" + position + "px, 0px, 0px)"
				@target.style["MozTransform"] = "translate3d(" + position + "px, 0px, 0px)"
				@target.style["msTransform"] = "translate3d(" + position + "px, 0px, 0px)"
				@lastPosition = @mouse.xCurr
		else if @horizontalOrientation is false
			
			# VERTICAL SCANNING
			@currentPosition += (@mouse.yCurr - @currentPosition)
			if @mouse.yCurr isnt @lastPosition
				position = parseFloat(@currentPosition / @containerDimensions.h)
				position = @overflowArea.y * position
				@target.style["webkitTransform"] = "translate3d( 0px, " + position + "px, 0px)"
				@target.style["MozTransform"] = "translate3d( 0px, " + position + "px, 0px)"
				@target.style["msTransform"] = "translate3d( 0px, " + position + "px, 0px)"
				@lastPosition = @mouse.yCurr
		return
