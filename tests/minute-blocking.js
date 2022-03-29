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

test("2 min gap between blocks, min requirement 60 mins", () => {
  const minRange = new AvailabilityMinuteRange();

  const blocked1 = minRange.blockTime(
    new Date(new Date().setHours(0, 0, 0, 0)),
    new Date(new Date().setHours(1, 0, 0, 0))
  );

  const blocked2 = minRange.blockTime(
    new Date(new Date().setHours(1, 2, 0, 0)),
    new Date(new Date().setHours(1, 30, 0, 0))
  );

  const availability = minRange.nextAvailableFrom(
    new Date(new Date().setHours(1, 0, 0)),
    60
  );

  assert.ok(blocked1);
  assert.ok(blocked2);
  assert.ok(availability.availableFor >= 60);
});

test("blocked completely", () => {
  const minRange = new AvailabilityMinuteRange();

  const blocked1 = minRange.blockTime(
    new Date(new Date().setHours(0, 0, 0, 0)),
    new Date(new Date().setHours(23, 59, 59))
  );

  const blocked2 = minRange.blockTime(
    new Date(new Date().setHours(1, 2, 0, 0)),
    new Date(new Date().setHours(1, 30, 0, 0))
  );

  const availability = minRange.nextAvailableFrom(
    new Date(new Date().setHours(1, 0)),
    60
  );

  assert.not(availability.availableFor);
  assert.ok(blocked1);
  assert.not(blocked2);
});

test("Multiple Ranges", () => {
  const hotelOne = new AvailabilityMinuteRange();
  const hotelTwo = new AvailabilityMinuteRange();
  let bookedSecond = false;

  // book first one for 2 hours
  hotelOne.blockTime(
    new Date(new Date().setHours(0, 0, 0, 0)),
    new Date(new Date().setHours(2, 0, 0, 0))
  );

  // book the same hotel for the same time
  const blocked2 = hotelOne.blockTime(
    new Date(new Date().setHours(0, 0, 0, 0)),
    new Date(new Date().setHours(2, 0, 0, 0))
  );

  if (!blocked2) {
    bookedSecond = hotelTwo.blockTime(
      new Date(new Date().setHours(0, 0, 0, 0)),
      new Date(new Date().setHours(2, 0, 0, 0))
    );
  }

  assert.ok(bookedSecond);
});

test("30 min between blocks, min requirement 30 mins", () => {
  const minRange = new AvailabilityMinuteRange();

  const blocked1 = minRange.blockTime(
    new Date(new Date().setHours(0, 0, 0, 0)),
    new Date(new Date().setHours(1, 0, 0, 0))
  );

  const blocked2 = minRange.blockTime(
    new Date(new Date().setHours(1, 30, 0, 0)),
    new Date(new Date().setHours(2, 0, 0, 0))
  );

  const availability = minRange.nextAvailableFrom(
    new Date(new Date().setHours(1, 0, 0, 0)),
    30
  );

  assert.ok(blocked1);
  assert.ok(blocked2);
  assert.ok(availability.availableFor >= 60);
});

test.run();
