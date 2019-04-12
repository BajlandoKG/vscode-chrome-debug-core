/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
import { ValidatedMap } from '../../collections/validatedMap';
import { IActionToTakeWhenPaused } from './actionToTakeWhenPaused';
import { ShouldStepInToAvoidSkippedSource } from './smartStep';
import { HitBreakpoint, NoRecognizedBreakpoints } from '../breakpoints/features/bpRecipeAtLoadedSourceLogic';
import { HitStillPendingBreakpoint, PausedWhileLoadingScriptToResolveBreakpoints } from '../breakpoints/features/pauseScriptLoadsToSetBPs';
import { ExceptionWasThrown, PromiseWasRejected } from '../exceptions/pauseOnException';
import { HitAndSatisfiedHitCountBreakpoint, HitCountBreakpointWhenConditionWasNotSatisfied } from '../breakpoints/features/hitCountBreakpointsSetter';

export type ActionToTakeWhenPausedClass = { new(...args: any[]): IActionToTakeWhenPaused };

const actionsFromHighestToLowestPriority: ActionToTakeWhenPausedClass[] = [
    ShouldStepInToAvoidSkippedSource, // Stepping in to avoid a skipper source takes preference over hitting breakpoints, etc...

    HitAndSatisfiedHitCountBreakpoint,
    HitBreakpoint,
    HitStillPendingBreakpoint,
    ExceptionWasThrown,
    PromiseWasRejected,

    PausedWhileLoadingScriptToResolveBreakpoints,

    HitCountBreakpointWhenConditionWasNotSatisfied,

    NoRecognizedBreakpoints,
];

const priorityIndexAndActionClassPairs = actionsFromHighestToLowestPriority.map((situationClass, index) => <[ActionToTakeWhenPausedClass, number]>[situationClass, index]);
export const actionClassToPriorityIndexMapping = new ValidatedMap(priorityIndexAndActionClassPairs);
