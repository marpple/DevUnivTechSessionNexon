import type {Todo} from "./Todo";
import {CustomEventWithDetail} from "rune-ts";

export class TodoRemoveRequested extends CustomEventWithDetail<Todo> {}
