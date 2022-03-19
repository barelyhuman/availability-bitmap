import { AvailabilityMinuteRange } from "../src";
import { test } from "uvu";
import * as assert from "uvu/assert";

test("Basic Overlaping block", () => {
  const minRange = new AvailabilityMinuteRange();

  const blocked1 = minRange.blockTime(
    new Date(new Date().setHours(0, 0, 0, 0)),
    new Date(new Date().setHours(1, 0, 0, 0))
  );

  const blocked2 = minRange.blockTime(
    new Date(new Date().setHours(0, 0, 0, 0)),
    new Date(new Date().setHours(1, 0, 0, 0))
  );

  assert.ok(blocked1);
  assert.not(blocked2);
});

test("Basic Overlaping Block over minutes", () => {
  const minRange = new AvailabilityMinuteRange();

  const blocked1 = minRange.blockTime(
    new Date(new Date().setHours(0, 0, 0, 0)),
    new Date(new Date().setHours(1, 0, 0, 0))
  );

  const blocked2 = minRange.blockTime(
    new Date(new Date().setHours(0, 30, 0, 0)),
    new Date(new Date().setHours(1, 30, 0, 0))
  );

  assert.ok(blocked1);
  assert.not(blocked2);
});

test.run();
