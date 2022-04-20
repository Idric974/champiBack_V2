.then(() => {
    let actionDelta = () => {

         if (deltaHum > 2) {
            // console.log(
            //   magenta,
            //   '[ GESTION HUM CALCULES  ] DeltaHum >  0 : On ne fait rien'
            // );
          }
          
          else if (delta <= 2 && delta >= -2) {
            //***************************************************************
            //! Pas d'action car interval entre 2% et -2%"
     } 
     



      if (deltaHum >= -5 && deltaMum < -2) {
        let eau = () => {
          // Activation de l'eau au sol.

          const realyOn = new Gpio(16, 'out');

          // console.log(
          //   magenta,
          //   "[ GESTION HUM CALCULES  ] DeltaHum <  0 : Activation de l'eau au sol."
          // );
        };
        eau();

        // Déactivation de l'eau au sol.
        setTimeout((eau) => {
          const realyOff = new Gpio(16, 'in');

          // console.log(
          //   magenta,
          //   "[ GESTION HUM CALCULES  ] Déactivation de l'eau au sol."
          // );
        }, 10000);
         else if (deltaHum >= 10 && deltaMum < -5) {
            let eau = () => {
              // Activation de l'eau au sol.
    
              const realyOn = new Gpio(16, 'out');
    
              // console.log(
              //   magenta,
              //   "[ GESTION HUM CALCULES  ] DeltaHum <  0 : Activation de l'eau au sol."
              // );
            };
            eau();
    
            // Déactivation de l'eau au sol.
            setTimeout((eau) => {
              const realyOff = new Gpio(16, 'in');
    
              // console.log(
              //   magenta,
              //   "[ GESTION HUM CALCULES  ] Déactivation de l'eau au sol."
              // );
            }, 30000);
            else if ( deltaMum <- 10) {
                let eau = () => {
                  // Activation de l'eau au sol.
        
                  const realyOn = new Gpio(16, 'out');
        
                  // console.log(
                  //   magenta,
                  //   "[ GESTION HUM CALCULES  ] DeltaHum <  0 : Activation de l'eau au sol."
                  // );
                };
                eau();
        
                // Déactivation de l'eau au sol.
                setTimeout((eau) => {
                  const realyOff = new Gpio(16, 'in');
        
                  // console.log(
                  //   magenta,
                  //   "[ GESTION HUM CALCULES  ] Déactivation de l'eau au sol."
                  // );
                }, 120000);
    
        ////////////////////////////////////////////////////////////////////////////
        
    };

    actionDelta();
  })