# Canvas Styling

The player will be injected in the a component with the className "unity-container". To style to player use the following sass styling. To style the loader you can style the component with the className "unity-loader". See the example below.

```scss
.unity {
  .unity-container {
    canvas {
    }
  }
  .unity-loader {
    .bar {
      .fill {
        /* the width will be set by the component */
      }
    }
  }
}
```
