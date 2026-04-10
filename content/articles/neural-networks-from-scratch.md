---
title: "Neural Networks from Scratch: The Surprisingly Simple Math"
subtitle: "Gradient descent is just walking downhill, and backprop is just the chain rule"
date: "2026-04-05"
category: "AI"
tags: ["neural-networks", "machine-learning", "mathematics", "backpropagation"]
relatedSlugs: ["what-is-entropy"]
readingTime: 15
seo:
  title: "Neural Networks from Scratch"
  description: "Build intuition for neural networks by understanding the math from first principles."
---

## The Mystique Problem

Neural networks have a PR problem. They're described with words like "deep learning," "artificial intelligence," and "neural" — all of which make them sound impossibly complex and vaguely biological.

Here's the secret: **a neural network is just a function**. A very flexible function with lots of adjustable parameters, but a function nonetheless. It takes inputs, does math, and produces outputs.

Let's demystify it.

## A Single Neuron

The simplest neural network is a single neuron. It does three things:

1. Takes some inputs ($x_1, x_2, ..., x_n$)
2. Multiplies each by a weight ($w_1, w_2, ..., w_n$) and adds a bias ($b$)
3. Passes the result through an activation function ($\sigma$)

$$y = \sigma(w_1 x_1 + w_2 x_2 + ... + w_n x_n + b)$$

That's it. That's a neuron. It's a weighted sum followed by a nonlinear function.

The activation function (commonly ReLU, sigmoid, or tanh) adds nonlinearity. Without it, stacking neurons would just give you another linear function, which would be pointless.

## Layers and Networks

Stack neurons in layers, and you get a neural network:

- **Input layer**: your data (pixel values, word embeddings, whatever)
- **Hidden layers**: where the magic happens (each neuron takes outputs from the previous layer)
- **Output layer**: the prediction (a class probability, a number, etc.)

A "deep" neural network just means it has many hidden layers. That's it. "Deep learning" literally just means "lots of layers."

## The Learning Part

A neural network starts with random weights. It's terrible at its job. To improve, it needs to **learn** — which means adjusting its weights to minimize errors.

This happens in three steps:

### 1. Forward Pass

Feed data through the network and get a prediction. Compare it to the true answer using a **loss function** (like mean squared error or cross-entropy).

### 2. Backward Pass (Backpropagation)

Here's where people's eyes glaze over, but it's actually just calculus:

- The loss is a function of the weights: $L(w)$
- We want to find how each weight affects the loss: $\frac{\partial L}{\partial w}$
- We use the **chain rule** to propagate gradients backward through the network

If you survived calculus, you already know the chain rule:

$$\frac{\partial L}{\partial w_1} = \frac{\partial L}{\partial y} \cdot \frac{\partial y}{\partial z} \cdot \frac{\partial z}{\partial w_1}$$

Backpropagation is just applying this chain rule systematically from the output layer back to the input. That's all it is.

### 3. Gradient Descent

Now you know how each weight affects the loss. To reduce the loss, nudge each weight in the opposite direction of its gradient:

$$w_{new} = w_{old} - \alpha \cdot \frac{\partial L}{\partial w}$$

Where $\alpha$ is the **learning rate** — how big a step you take.

This is gradient descent: you're on a hilly landscape (the loss surface), and you're walking downhill. Each step moves you toward a lower loss. Eventually, you reach a valley (a minimum).

## An Analogy

Imagine you're blindfolded on a mountain and need to reach the lowest point:

1. **Feel the slope** under your feet (compute the gradient)
2. **Step downhill** (update weights)
3. **Repeat** until you stop going down (convergence)

That's gradient descent. If the mountain has multiple valleys, you might end up in a local minimum instead of the global one. That's a real problem, but in high-dimensional spaces (which neural networks live in), it turns out to be less of an issue than you'd think.

## Why It Works

Neural networks are **universal function approximators**. Given enough neurons, a neural network can approximate any continuous function to arbitrary precision. This was proven mathematically (the Universal Approximation Theorem).

This doesn't mean they'll always *learn* the right function — that depends on training data, architecture, and optimization. But the *capacity* is there.

## The Code

Here's a minimal neural network in Python, just to prove it's not magic:

```python
import numpy as np

def relu(x):
    return np.maximum(0, x)

def relu_derivative(x):
    return (x > 0).astype(float)

# Random 2-layer network
np.random.seed(42)
W1 = np.random.randn(2, 4) * 0.5
b1 = np.zeros((1, 4))
W2 = np.random.randn(4, 1) * 0.5
b2 = np.zeros((1, 1))

# XOR problem
X = np.array([[0,0], [0,1], [1,0], [1,1]])
y = np.array([[0], [1], [1], [0]])

lr = 0.1
for epoch in range(1000):
    # Forward
    z1 = X @ W1 + b1
    a1 = relu(z1)
    z2 = a1 @ W2 + b2
    pred = z2  # linear output

    # Loss
    loss = np.mean((pred - y) ** 2)

    # Backward
    d2 = 2 * (pred - y) / len(y)
    dW2 = a1.T @ d2
    db2 = d2.sum(axis=0, keepdims=True)
    d1 = (d2 @ W2.T) * relu_derivative(z1)
    dW1 = X.T @ d1
    db1 = d1.sum(axis=0, keepdims=True)

    # Update
    W1 -= lr * dW1
    b1 -= lr * db1
    W2 -= lr * dW2
    b2 -= lr * db2
```

That's a working neural network in ~30 lines. No frameworks, no black boxes. Just matrix multiplication, a nonlinearity, and gradient descent.

## The Connection to Everything

Neural networks sit at the intersection of:

- **Linear algebra** (matrix operations)
- **Calculus** (gradients and the chain rule)
- **Statistics** (loss functions and probability)
- **Information theory** (cross-entropy, which is directly related to Shannon entropy)

That last connection is interesting. Cross-entropy loss — the standard loss function for classification — is literally Shannon's entropy formula applied to the difference between predicted and true distributions. The math of learning is the math of information.

## The Takeaway

Neural networks aren't magic. They're:

1. **Flexible functions** (universal approximators)
2. **Trained by walking downhill** (gradient descent)
3. **Using high school calculus** (the chain rule)
4. **At massive scale** (millions of parameters, billions of data points)

The "intelligence" isn't in any single component. It's in the scale, the data, and the optimization. Understanding the pieces makes the whole thing feel less like science fiction and more like engineering.

*And that's way more interesting than magic.*
