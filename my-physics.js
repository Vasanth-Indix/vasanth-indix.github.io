$(function(){

	var data = [{"name":"Apparel","class":"apparel"},{"name":"Arts, Crafts & Sewing","class":"arts"},{"name":"Automotive","class":"automotive"},{"name":"Baby Essentials","class":"baby"},{"name":"Grocery, Health & Personal Care","class":"ghpc"},{"name":"Home","class":"home"},{"name":"Home Improvement","class":"home-improvement"},{"name":"Industrial & Scientific","class":"industrial"},{"name":"Jewelry","class":"jewelry"},{"name":"Music & Movies","class":"movies"},{"name":"Musical Instruments","class":"musical-instruments"},{"name":"Patio, Lawn & Garden","class":"garden"},{"name":"Pet Supplies","class":"pets"},{"name":"Shoes & Accessories","class":"shoes"},{"name":"Software","class":"software"},{"name":"Sports & Outdoors","class":"sports"},{"name":"Tools & Hardware","class":"tools"},{"name":"Toys & Games","class":"toys"},{"name":"Video Games","class":"video-games"},{"name":"B2B","class":"b2b"},{"name":"Services","class":"services-1"},{"name":"Commodities","class":"commodities"},{"name":"Services","class":"services-2"},{"name":"Rentals","class":"rentals"},{"name":"Used Products","class":"used"}];

	Physics(function(world){

	  var viewWidth = $('body').width();
	  var viewHeight = $('body').height();

	  var renderer = Physics.renderer('canvas', {
	    el: document.getElementById('viewport'),
	    width: viewWidth,
	    height: viewHeight,
	    meta: false, // don't display meta data
	    styles: {
	        // set colors for the circle bodies
	        'circle' : {
	            strokeStyle: '#ff0000',
	            lineWidth: 1,
	            fillStyle: '#00ff00',
	            angleIndicator: '#351024',
	        }
	    }
	  });

	  // add the renderer
	  world.add( renderer );
	  // render on each step
	  world.on('step', function(){
	    world.render();
	  });

	  // bounds of the window
	  var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);

	  // constrain objects to these bounds
	  world.add(Physics.behavior('edge-collision-detection', {
	      aabb: viewportBounds,
	      restitution: 0.99,
	      cof: 0.99
	  }));

	  Physics.body('category', 'circle', function( parent ){
		  return {
			        setImage: function(){
			        	if(this.index < 10)
            			this.view.src = "category-icons/category-icons [www.imagesplitter.net]-0-" + this.index +".png";
            		else if(this.index < 20)
            			this.view.src = "category-icons/category-icons [www.imagesplitter.net]-1-" + (this.index%10) +".png";
            		else if(this.index < 30)
            			this.view.src = "category-icons/category-icons [www.imagesplitter.net]-1-" + (this.index%10) +".png";
            		else
            			this.view.src = "world-circle.png"
			        }
			        
			    };
			});

	  // add a circle
	  var categories = [];
	  for(var i=0;i<data.length;i++){
	  	var category = Physics.body('category', {
		        x: 50 + (i * 10), // x-coordinate
		        y: 30 + (i * 10), // y-coordinate
		        vx: 0.2, // velocity in x-direction
		        vy: 0.01, // velocity in y-direction
		        radius: 20,
		        value: data[i],
		        index: i
		      });
		  world.add(category);
			categories.push(category);
  	}

  	var sun = Physics.body('category', {
        x: 1000,
        x: viewHeight/2,
        radius: 200
  	})

  	world.add(sun);

  	world.on('step', function( data ){
      for(var cat in categories){
      	categories[cat].setImage();
      }
      sun.setImage();
      // only execute callback once
      world.off( 'step', data.handler );
  	});

  	

	  // ensure objects bounce when edge collision is detected
	  world.add( Physics.behavior('body-impulse-response') );

	  // add some gravity
	  world.add( Physics.behavior('constant-acceleration') );

	  // subscribe to ticker to advance the simulation
	  Physics.util.ticker.on(function( time, dt ){

	      world.step( time );
	  });

	  // start the ticker
	  Physics.util.ticker.start();

	});
});