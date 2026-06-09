// Static content for the /flying page
// Pre-written, no API call needed — works offline once cached

export const FLYING_CONTENT = {
  headline: "You're okay.",
  subheadline: "Here's what's actually happening right now.",

  sections: [
    {
      title: "What turbulence is",
      body: "The plane is flying through air that's moving unevenly — like a car hitting a bumpy road. The aircraft isn't falling. It isn't in danger. It's doing exactly what it was built to do: push through uneven air and come out the other side.",
    },
    {
      title: "What the pilots are doing",
      body: "They've seen this on their radar. They may have already asked the cabin crew to sit down. They're either flying through it — because it's short — or they're requesting a different altitude from air traffic control to find smoother air. Either way, they're not concerned. This is Tuesday for them.",
    },
    {
      title: "What those sounds mean",
      body: "The creaking is the aircraft flexing. It's designed to flex — a rigid plane would break. The engines changing pitch means the pilots are adjusting thrust, which is normal. The rattling in the overhead bins is just loose items. None of this means anything is wrong.",
    },
    {
      title: "How long it lasts",
      body: "Most turbulence lasts 5 to 15 minutes. Severe turbulence that lasts more than a few minutes is genuinely rare. What feels like a long time when you're scared is usually a few minutes on a clock.",
    },
  ],

  breathingPrompt: {
    instruction: "If your heart is racing, try this:",
    steps: ["Breathe in for 4", "Hold for 4", "Out for 4"],
    note: "Repeat 3 times. It actually works — slows your heart rate within 60 seconds.",
  },

  closer: "The plane knows what to do. So does the crew. You just have to sit with the discomfort for a bit, and it will pass.",
};
