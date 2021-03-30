<p class="item" id="name">Juliette Pagacz</p>
            <p class="item" id="title">2</p>
            <div class="item" id="planet">
                <canvas id='globe' width='100' height='100' style="cursor: move"></canvas>
                <script type='text/javascript' src='https://d3js.org/d3.v3.min.js'></script>
                <script type='text/javascript' src='https://d3js.org/topojson.v1.min.js'></script>
                <script type='text/javascript' src='https://cdn.rawgit.com/BinaryMuse/planetary.js/v1.1.2/dist/planetaryjs.min.js'></script>
                <script type="text/javascript">
                    var planet = planetaryjs.planet();

                    // You can remove this statement if `world-110m.json`
                    // is in the same path as the HTML page:
                    planet.loadPlugin(planetaryjs.plugins.earth({
                        topojson: {
                            file: 'https://raw.githubusercontent.com/BinaryMuse/planetary.js/v1.1.2/dist/world-110m.json'
                        },
                        /* Let's add some color to the globe */
                        oceans: {
                            fill: '#3d54fe'
                        },
                        land: {
                            fill: '#F5F4F0'
                        },
                        borders: {
                            stroke: '#7c7c79'
                        }
                    }));
                    // The `pings` plugin draws animated pings on the globe.
                    planet.loadPlugin(planetaryjs.plugins.pings());
                    // The `zoom` and `drag` plugins enable
                    // manipulating the globe with the mouse.
                    planet.loadPlugin(planetaryjs.plugins.zoom({
                        scaleExtent: [50, 50]
                    }));

                    // !! ajouté d'un autre planetary par mes soins. !!
                    planet.loadPlugin(planetaryjs.plugins.drag({
                        // Dragging the globe should pause the
                        // automatic rotation until we release the mouse.
                        onDragStart: function() {
                            this.plugins.autorotate.pause();
                        },
                        onDragEnd: function() {
                            this.plugins.autorotate.resume();
                        }
                    }));

                    // Load our custom autorotate plugin
                    planet.loadPlugin(autorotate(10));

                    // Load the `pings` plugin to draw animated pings on the globe
                    planet.loadPlugin(planetaryjs.plugins.pings({
                        color: '#670afd',
                        ttl: 1000,
                        angle: 10
                    }));

                    // Make the planet fit well in its canvas
                    planet.projection.scale(45).translate([50, 50]);
                    var canvas = document.getElementById('globe');
                    planet.draw(canvas);

                    // Get location when clicking the button
                    var locationButton = window.document.getElementById('see-my-location-button');
                    locationButton.addEventListener('click', function() {
                        // Disable button while we get the location
                        locationButton.setAttribute('disabled', 'true');
                        // Change button label
                        locationButton.innerText = 'Getting location...';
                        navigator.geolocation.getCurrentPosition(function(position) {
                            // Success callback
                            showLocation(position);
                            locationButton.innerText = 'Done, look at the globe';
                        }, geoError);
                    });

                    // Helper function to add one ping on the globe
                    function showLocation(position) {
                        var latitude = position.coords.latitude;
                        var longitude = position.coords.longitude;
                        // Add a ping on the globe every second
                        setInterval(function() {
                            planet.plugins.pings.add(longitude, latitude);
                        }, 1000);
                    }

                    // Geolocation API error callback
                    function geoError(posError) {
                        locationButton.classList.add('error');
                        locationButton.innerText = posError.message;
                    }

                    // This plugin will automatically rotate the globe around its vertical
                    // axis a configured number of degrees every second.
                    function autorotate(degPerSec) {
                        // Planetary.js plugins are functions that take a `planet` instance
                        // as an argument...
                        return function(planet) {
                            var lastTick = null;
                            var paused = false;
                            planet.plugins.autorotate = {
                                pause: function() {
                                    paused = true;
                                },
                                resume: function() {
                                    paused = false;
                                }
                            };
                            // ...and configure hooks into certain pieces of its lifecycle.
                            planet.onDraw(function() {
                                if (paused || !lastTick) {
                                    lastTick = new Date();
                                } else {
                                    var now = new Date();
                                    var delta = now - lastTick;
                                    // This plugin uses the built-in projection (provided by D3)
                                    // to rotate the globe each time we draw it.
                                    var rotation = planet.projection.rotate();
                                    rotation[0] += degPerSec * delta / 1000;
                                    if (rotation[0] >= 180) rotation[0] -= 360;
                                    planet.projection.rotate(rotation);
                                    lastTick = now;
                                }
                            });
                        };
                    };

                </script>
            </div>