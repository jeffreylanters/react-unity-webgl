# Unity Component

The Unity Component renders your Unity Player. The player can be configured with an Unity Content object. This allows you to create multiple Unity components all over your application and control them individually.

## Assigning the Unity Content

Once you've created your Unity Content you can pass it on the props of your Unity Component. See the object reference for further details. An implementation could look something like:

```jsx
<Unity unityContent={unityContent} />
```

## Other optional props

### Height and Weight

The default size is 800px width to 600px height. You can easily overrule them by passing the following props. The height and width properties are used to set the height and width of the wrapper element.

The height and width can be set to auto (Means that the browser calculates the height and width), or be specified in length values, like px, cm, etc., or in percent of the containing block. Note that the height and width properties do not include padding, borders, or margins; they set the height/width of the area inside the padding, border, and margin of the element!

```jsx
<Unity unityContent={unityContent} height="100%" width="950px" />
```

### ClassName

You can add an optional class name to the Unity component. The class name attribute specifies one or more class names for an HTML element. The class attribute is mostly used to point to a class in a style sheet. However, it can also be used by a JavaScript (via the HTML DOM) to make changes to HTML elements with a specified class.

```jsx
<Unity unityContent={unityContent} className="my-unity-app" />
```
