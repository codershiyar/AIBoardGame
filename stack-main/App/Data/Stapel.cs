using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace my_new_app
{
    // Stack class is a generic class
    public class Stack<T>
    { 
        private Node<T> topNode; // Used to store the top node of the stack.

        public Stack()
        {
            topNode = null;
        }

        // The stack uses an inner class called Node, which represents a node in the stack.
        private class Node<T>
        {
            public T value;
            public Node<T> next;

            public Node(T value)
            {
                this.value = value;
                this.next = null;
            }
        }

        // Adds a new value to the top of the stack.
        public void Push(T value)
        {
            if (value == null)
            {
                throw new InvalidDataException("Stack is empty");
            }
            // Here, a Node is created with the given value.
            Node<T> node = new Node<T>(value);
            // The current top node is assigned to the next of the new node.
            node.next = topNode;
            // The new node is now assigned as the top node.
            topNode = node;
        }

        // Retrieves the top value of the stack.
        public T Pop()
        {
            // Checks if the stack is empty by verifying the top node.
            if (topNode == null)
            {
                throw new InvalidOperationException("Stack is empty");
            }
            // If the stack is not empty, the value of the top node is saved to return.
            T poppedValue = topNode.value;
            // The top node is replaced with the next node in the stack.
            topNode = topNode.next;
            // The popped value is returned.
            return poppedValue;
        }
    }
}
