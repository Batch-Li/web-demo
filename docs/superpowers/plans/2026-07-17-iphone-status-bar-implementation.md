# iPhone 16 Status Bar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the compressed generic status icon strip with a structurally and geometrically credible iPhone 16 light status bar.

**Architecture:** Keep `PhoneFrame` as the device-shell owner, but extract the status presentation into `IosStatusBar`. The new component owns live local time and three independent inline SVG icons; CSS owns the 393px-screen safe-area geometry and responsive hiding.

**Tech Stack:** React 19, inline SVG, CSS, Vitest, Vite.

## Global Constraints

- Preserve the 393 × 852 active screen and the existing 125 × 37px Dynamic Island.
- Use CSS and inline SVG only; do not add Apple-distributed assets, screenshots, or dependencies.
- Show the simulated status bar only above the existing 600px responsive breakpoint.
- Keep the status area fixed at 54px and prevent overlap with the Dynamic Island.
- Display dynamic local time and a clearly non-full 78% battery.

---

### Task 1: Lock the status-bar contract with a failing test

**Files:**
- Modify: `src/logic.test.js`
- Test: `src/logic.test.js`

**Interfaces:**
- Consumes: current `App.jsx` and `styles.css` source-contract tests.
- Produces: assertions for `IosStatusBar`, three independent status icons, exact status geometry, and removal of `ios-status-icons`.

- [x] **Step 1: Write the failing source-contract test**

Update the existing iPhone geometry test to require:

```js
expect(appSource).toContain("function IosStatusBar")
expect(appSource).toContain('className="ios-cellular"')
expect(appSource).toContain('className="ios-wifi"')
expect(appSource).toContain('className="ios-battery"')
expect(appSource).not.toContain("ios-status-icons")
expect(getCssRule(styles, ".phone-status")).toContain("height: 54px")
expect(getCssRule(styles, ".phone-status")).toContain("grid-template-columns: 82px 1fr 82px")
expect(getCssRule(styles, ".ios-system-status")).toContain("grid-template-columns: 18px 17px 27px")
```

- [x] **Step 2: Run the targeted test and verify RED**

Run: `npm test -- --run -t "uses iPhone 16 screen geometry and system chrome"`

Expected: FAIL because `IosStatusBar` and the independent icon classes do not exist.

- [x] **Step 3: Commit only after Task 2 turns the test green**

The test and implementation remain in one behavior commit so the branch never contains a test-only broken state.

---

### Task 2: Implement and verify the iPhone status bar

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles.css`
- Modify: `DESIGN.md`
- Test: `src/logic.test.js`

**Interfaces:**
- Consumes: `PhoneFrame`, existing `.device-island`, and the 600px responsive rule.
- Produces: `IosStatusBar`, `.ios-system-status`, `.ios-cellular`, `.ios-wifi`, and `.ios-battery`.

- [x] **Step 1: Add live time and independent icon markup**

Import `useEffect` and `useState`, then add a focused component:

```jsx
function IosStatusBar() {
  const [time, setTime] = useState(() => formatIosTime(new Date()));

  useEffect(() => {
    let minuteTimer;
    const updateTime = () => setTime(formatIosTime(new Date()));
    const boundaryTimer = window.setTimeout(() => {
      updateTime();
      minuteTimer = window.setInterval(updateTime, 60_000);
    }, 60_000 - (Date.now() % 60_000));

    return () => {
      window.clearTimeout(boundaryTimer);
      if (minuteTimer) window.clearInterval(minuteTimer);
    };
  }, []);

  return (
    <div className="phone-status" aria-hidden="true">
      <span className="ios-time">{time}</span>
      <span />
      <div className="ios-system-status">
        <svg className="ios-cellular" />
        <svg className="ios-wifi" />
        <svg className="ios-battery" />
      </div>
    </div>
  );
}
```

Use rounded cellular bars, stroked Wi-Fi arcs, and a 78% battery fill with a separate cap.

- [x] **Step 2: Replace generic Flex geometry with safe-area grid geometry**

Implement these layout contracts in `src/styles.css`:

```css
.phone-status {
  height: 54px;
  grid-template-columns: 82px 1fr 82px;
  padding: 0 26px;
}

.ios-system-status {
  grid-template-columns: 18px 17px 27px;
  column-gap: 5px;
}
```

Size each SVG independently and retain the existing mobile rule that hides `.phone-status`.

- [x] **Step 3: Run targeted and full automated verification**

Run:

```bash
npm test -- --run -t "uses iPhone 16 screen geometry and system chrome"
npm test
npm run build
```

Expected: targeted test passes, all 36+ tests pass, and Vite exits 0.

- [x] **Step 4: Run real-browser visual QA**

Capture the scan home at 1280 × 900 and 1280 × 720, plus 375 × 812 mobile. Verify the time and icon group remain outside the Dynamic Island, the battery is visibly non-full, desktop icons remain crisp, and the simulated status bar is absent on mobile.

- [x] **Step 5: Commit and publish**

Stage only `src/App.jsx`, `src/styles.css`, `src/logic.test.js`, `DESIGN.md`, and this plan. Commit with the repository's Chinese message style, push `main`, wait for `Deploy GitHub Pages`, and verify the deployment SHA.
