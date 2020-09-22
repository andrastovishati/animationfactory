# Animation Factory
Animation Factory is a lightweight javascript animation engine.

## Usage

```javascript
AF.create('myFirstAnimation', {
  object:myObj,
  duration:1200,
  delay:200,
  easing:'BackIn',
  timeline:[{
    to:{x:2},
    easing:'BounceOut'
  },{
    to:{x:2, z:1},
    easing:'BounceIn',
    duration:2000
  }]
});

AF.play('myFirstAnimation');

```

### Animate more things together:

```javascript
AF.create('mySecondAnimation', {
  object:myObj1,
  duration:1200,
  delay:200,
  easing:'BackIn',
  timeline:[{
    to:{x:2},
    easing:'BounceOut'
  },{
    to:{x:2, z:1},
    easing:'BounceIn',
    duration:2000
  }]
},{
  object:myObj2,
  duration:2500,
  delay:500,
  easing:'BackOut',
  timeline:[{
    to:{x:2},
    easing:'BounceOut'
  },{
    to:{y:2, z:-1},
    easing:'Linear',
    duration:2000
  }]
});

AF.play('mySecondAnimation');
```
