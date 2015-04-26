//
// Simple example of a newtonian orbit
//
$(function(){

Physics(function (world) {

    var viewWidth = window.innerWidth
        ,viewHeight = window.innerHeight
        // bounds of the window
        ,viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight)
        ,edgeBounce
        ,renderer
        ;

    // create a renderer
    renderer = Physics.renderer('canvas', {
        el: document.getElementById('viewport')
        ,width: viewWidth
        ,height: viewHeight
    });

    // add the renderer
    world.add(renderer);
    // render on each step
    world.on('step', function () {
        world.render();
    });

    // constrain objects to these bounds
    edgeBounce = Physics.behavior('edge-collision-detection', {
        aabb: viewportBounds
        ,restitution: 0.99
        ,cof: 0.8
    });

    // resize events
    window.addEventListener('resize', function () {

        viewWidth = window.innerWidth;
        viewHeight = window.innerHeight;

        renderer.el.width = viewWidth;
        renderer.el.height = viewHeight;

        viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);
        // update the boundaries
        edgeBounce.setAABB(viewportBounds);

    }, true);

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

    var data = [{"name":"Apparel","class":"apparel"},{"name":"Arts, Crafts & Sewing","class":"arts"},{"name":"Automotive","class":"automotive"},{"name":"Baby Essentials","class":"baby"},{"name":"Grocery, Health & Personal Care","class":"ghpc"},{"name":"Home","class":"home"},{"name":"Home Improvement","class":"home-improvement"},{"name":"Industrial & Scientific","class":"industrial"},{"name":"Jewelry","class":"jewelry"},{"name":"Music & Movies","class":"movies"},{"name":"Musical Instruments","class":"musical-instruments"},{"name":"Patio, Lawn & Garden","class":"garden"},{"name":"Pet Supplies","class":"pets"},{"name":"Shoes & Accessories","class":"shoes"},{"name":"Software","class":"software"},{"name":"Sports & Outdoors","class":"sports"},{"name":"Tools & Hardware","class":"tools"},{"name":"Toys & Games","class":"toys"},{"name":"Video Games","class":"video-games"},{"name":"B2B","class":"b2b"},{"name":"Services","class":"services-1"},{"name":"Commodities","class":"commodities"},{"name":"Services","class":"services-2"},{"name":"Rentals","class":"rentals"},{"name":"Used Products","class":"used"}];

    // create some bodies

    // add a circle
    var categories = [];
    for(var i=0;i<data.length;i++){
      var category = Physics.body('category', {
             x: (viewWidth / 2)
            ,y: (viewHeight / 2 - 240) + (i * 10)
            ,vx: -0.95
            ,mass: 1
            ,radius: 30
            ,value: data[i]
            ,index: i
            ,styles: {
              fillStyle: '#cb4b16'
              ,angleIndicator: '#72240d'
            }
          });
      world.add(category);
      categories.push(category);
    }


    var sun = Physics.body('category', {
        x: viewWidth / 2
        ,y: viewHeight / 2
        ,radius: 50
        ,mass: 20
        ,vx: 0.007
        ,vy: 0
        ,styles: {
            fillStyle: '#6c71c4'
            ,angleIndicator: '#3b3e6b'
        }
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


    // world.add( Physics.body('circle', {
    //     x: viewWidth / 2
    //     ,y: viewHeight / 2 - 240
    //     ,vx: -0.15
    //     ,mass: 1
    //     ,radius: 30
    //     ,styles: {
    //         fillStyle: '#cb4b16'
    //         ,angleIndicator: '#72240d'
    //     }
    // }));

    

    // add some fun interaction
    var attractor = Physics.behavior('attractor', {
        order: 0,
        strength: .002
    });
    world.on({
        'interact:poke': function( pos ){
            attractor.position( pos );
            world.add( attractor );
        }
        ,'interact:move': function( pos ){
            attractor.position( pos );
        }
        ,'interact:release': function(){
            world.remove( attractor );
        }
    });

    // add things to the world
    world.add([
        Physics.behavior('interactive', { el: renderer.el })
        ,Physics.behavior('newtonian', { strength: .5 })
        ,Physics.behavior('body-impulse-response')
        ,edgeBounce
    ]);

    // subscribe to ticker to advance the simulation
    Physics.util.ticker.on(function( time ) {
        world.step( time );
    });

    // start the ticker
    Physics.util.ticker.start();
});
})
